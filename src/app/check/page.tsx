'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getPeriodForAge } from '@/data/kdst';
import { calculateAgeMonths } from '@/lib/age-calculator';
import { scoreAssessment } from '@/lib/kdst-scoring';
import { calculateGrowthPercentiles } from '@/data/growth';
import { QuestionCard } from '@/components/check/QuestionCard';
import type { QuestionResponse, KDSTPeriod } from '@/types';

export default function CheckPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<{ id: string; name: string; birthdate: string; gender: 'male'|'female' } | null>(null);
  const [period, setPeriod] = useState<KDSTPeriod | null>(null);
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'physical' | 'kdst'>('physical');
  const [height, setHeight] = useState<string>('');
  const [weight, setWeight] = useState<string>('');

  useEffect(() => {
    const stored = localStorage.getItem('ieye_profile');
    if (!stored) { router.push('/'); return; }
    try {
      const p = JSON.parse(stored);
      setProfile(p);
      const ageMonths = calculateAgeMonths(p.birthdate);
      const foundPeriod = getPeriodForAge(ageMonths);
      if (foundPeriod) setPeriod(foundPeriod);
    } catch {
      router.push('/');
    }
  }, [router]);

  const handleScore = useCallback((questionId: string, score: number) => {
    setResponses((prev) => ({ ...prev, [questionId]: score }));
  }, []);

  const handleNext = () => {
    if (!period) return;
    if (currentIndex < period.questions.length - 1) setCurrentIndex((i) => i + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  const handleSubmit = async () => {
    if (!profile || !period) return;
    setSubmitting(true);
    setError(null);

    try {
      const ageMonths = calculateAgeMonths(profile.birthdate);
      const questionResponses: QuestionResponse[] = period.questions.map((q) => ({
        questionId: q.id,
        score: responses[q.id] ?? 0,
      }));

      // Client-side scoring (no API needed for static export)
      const result = scoreAssessment(questionResponses, period, profile.id, ageMonths);

      // Add physical growth percentiles if provided
      if (height && weight) {
        const { heightPercentile, weightPercentile } = calculateGrowthPercentiles(
          ageMonths, profile.gender || 'female', Number(height), Number(weight)
        );
        result.height = Number(height);
        result.weight = Number(weight);
        result.heightPercentile = heightPercentile;
        result.weightPercentile = weightPercentile;
      }

      // Store in sessionStorage for results page
      sessionStorage.setItem('latest_result', JSON.stringify(result));

      // Save to localStorage history
      const historyKey = `ieye_history_${profile.id}`;
      const existing = JSON.parse(localStorage.getItem(historyKey) || '[]');
      existing.push(result);
      localStorage.setItem(historyKey, JSON.stringify(existing));

      // Optionally send to Google Apps Script if configured
      const gasUrl = process.env.NEXT_PUBLIC_GAS_URL;
      if (gasUrl) {
        fetch(gasUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'assessment', data: result, profile }),
        }).catch(() => {}); // Silently fail
      }

      router.push('/results');
    } catch (e) {
      setError('오류가 발생했습니다. 다시 시도해 주세요.');
      setSubmitting(false);
    }
  };

  if (!profile || !period) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="text-5xl animate-bounce">🌱</div>
          <p className="text-[#b3b3b3] font-medium">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (step === 'physical') {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in mt-4">
        <div>
          <h1 className="text-2xl font-black text-white">🌱 신체 발육 상태 입력</h1>
          <p className="text-[#727272] text-sm mt-1">질병관리청 2017 소아청소년 성장도표 기준으로 분석해 드립니다.</p>
        </div>
        <div className="bg-[#181818] rounded-2xl p-6 border border-[#282828] space-y-5">
          <div>
            <label className="block text-sm font-bold text-[#b3b3b3] mb-2">현재 키 (cm)</label>
            <input type="number" step="0.1" value={height} onChange={e => setHeight(e.target.value)} placeholder="예: 95.1"
              className="w-full bg-[#282828] border-2 border-[#383838] rounded-xl p-4 font-medium text-white placeholder-[#535353] focus:border-[#1DB954] focus:outline-none transition-all" />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#b3b3b3] mb-2">현재 몸무게 (kg)</label>
            <input type="number" step="0.1" value={weight} onChange={e => setWeight(e.target.value)} placeholder="예: 13.9"
              className="w-full bg-[#282828] border-2 border-[#383838] rounded-xl p-4 font-medium text-white placeholder-[#535353] focus:border-[#1DB954] focus:outline-none transition-all" />
          </div>
          <div className="pt-2 space-y-3">
            <button onClick={() => setStep('kdst')}
              className="w-full py-4 rounded-full bg-[#1DB954] text-black font-black text-lg hover:bg-[#1ed760] hover:scale-[1.02] transition-all"
              style={{boxShadow: '0 0 20px rgba(29,185,84,0.3)'}}>
              문진표 시작하기 →
            </button>
            {(!height || !weight) && (
              <p className="text-center text-xs text-[#535353]">* 키와 몸무게를 입력하지 않아도 진단을 시작할 수 있습니다.</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = period.questions[currentIndex];
  const totalAnswered = Object.keys(responses).length;
  const allAnswered = totalAnswered === period.questions.length;
  const progressPercent = Math.round((totalAnswered / period.questions.length) * 100);

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black text-white">✏️ KDST 자가 진단</h1>
        <p className="text-[#727272] text-sm mt-1">{period.label} | {profile.name} 엄마/아빠의 관찰 기준으로 평가해 주세요.</p>
      </div>

      <div className="bg-[#181818] rounded-2xl p-4 border border-[#282828] space-y-2">
        <div className="flex justify-between text-xs font-bold">
          <span className="text-[#727272]">진행률</span>
          <span className="text-[#1DB954]">{totalAnswered} / {period.questions.length} 완료</span>
        </div>
        <div className="h-1.5 bg-[#282828] rounded-full overflow-hidden">
          <div className="h-full bg-[#1DB954] rounded-full transition-all duration-300" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      <QuestionCard question={currentQuestion} questionNumber={currentIndex + 1} total={period.questions.length}
        currentScore={responses[currentQuestion.id]} onScore={handleScore} />

      <div className="flex items-center justify-between gap-3">
        <button onClick={handlePrev} disabled={currentIndex === 0}
          className="flex-1 py-3.5 rounded-full border-2 border-[#535353] text-[#b3b3b3] font-bold text-sm disabled:opacity-30 hover:border-white hover:text-white transition-all">
          ← 이전
        </button>
        {currentIndex < period.questions.length - 1 ? (
          <button onClick={handleNext}
            className="flex-1 py-3.5 rounded-full bg-[#1DB954] text-black font-black text-sm hover:bg-[#1ed760] transition-all">
            다음 →
          </button>
        ) : (
          <button onClick={handleSubmit} disabled={submitting || !allAnswered}
            className="flex-1 py-3.5 rounded-full bg-[#1DB954] text-black font-black text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#1ed760] transition-all"
            style={allAnswered && !submitting ? {boxShadow: '0 0 20px rgba(29,185,84,0.4)'} : {}}>
            {submitting ? '리포트 생성 중...' : '평가 완료 · 결과 보기 →'}
          </button>
        )}
      </div>

      {!allAnswered && (
        <p className="text-center text-xs text-[#f59e0b] font-semibold">
          ⚠️ 모든 항목에 응답해야 결과를 볼 수 있습니다. ({totalAnswered}/{period.questions.length})
        </p>
      )}
      {error && <div className="bg-red-900/30 border border-red-700/50 rounded-xl p-3 text-red-400 text-sm font-medium">{error}</div>}
    </div>
  );
}
