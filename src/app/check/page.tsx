'use client';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getPeriodForAge } from '@/data/kdst';
import { calculateAgeMonths, formatDate } from '@/lib/age-calculator';
import { scoreAssessment } from '@/lib/kdst-scoring';
import { addKdstResult, getKdstHistory, getProfile } from '@/lib/storage';
import type { Profile } from '@/lib/storage';
import { QuestionCard } from '@/components/check/QuestionCard';
import { GrowthLineChart } from '@/components/history/GrowthLineChart';
import { LevelBadge } from '@/components/results/LevelBadge';
import type { AssessmentResult, DevelopmentLevel, KDSTPeriod, QuestionResponse, SheetAssessmentRow } from '@/types';

export default function CheckPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [period, setPeriod] = useState<KDSTPeriod | null>(null);
  const [past, setPast] = useState<AssessmentResult[]>([]);
  const [mode, setMode] = useState<'intro' | 'quiz'>('intro');
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const p = getProfile();
    if (!p) { router.push('/'); return; }
    setProfile(p);
    const found = getPeriodForAge(calculateAgeMonths(p.birthdate));
    if (found) setPeriod(found);
    setPast(getKdstHistory(p.id));
  }, [router]);

  const handleScore = useCallback((questionId: string, score: number) => {
    setResponses((prev) => ({ ...prev, [questionId]: score }));
  }, []);

  const chartRows: SheetAssessmentRow[] = useMemo(
    () => past.map((r) => {
      const m = new Map((r.domainScores || []).map((d) => [d.domain, d.score]));
      return {
        date: r.assessmentDate, ageMonths: r.ageMonths, period: r.kdstPeriod,
        grossMotor: m.get('grossMotor') ?? 0, fineMotor: m.get('fineMotor') ?? 0,
        cognition: m.get('cognition') ?? 0, language: m.get('language') ?? 0,
        socialEmotional: m.get('socialEmotional') ?? 0, selfHelp: m.get('selfHelp') ?? 0,
        totalScore: r.overallScore || 0, overallLevel: r.overallLevel || 'normal', notes: '',
      };
    }),
    [past]
  );

  const openPastResult = (r: AssessmentResult) => {
    sessionStorage.setItem('latest_result', JSON.stringify(r));
    router.push('/results');
  };

  const handleSubmit = () => {
    if (!profile || !period) return;
    setSubmitting(true);
    setError(null);
    try {
      const ageMonths = calculateAgeMonths(profile.birthdate);
      const questionResponses: QuestionResponse[] = period.questions.map((q) => ({
        questionId: q.id,
        score: responses[q.id] ?? 0,
      }));
      const result = scoreAssessment(questionResponses, period, profile.id, ageMonths);
      sessionStorage.setItem('latest_result', JSON.stringify(result));
      addKdstResult(profile.id, result); // 저장 + (로그인 상태면) 계정에 자동 저장
      router.push('/results');
    } catch {
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

  /* ===================== 1) 안내 + 진단 이력 ===================== */
  if (mode === 'intro') {
    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-black text-white">✏️ KDST 자가진단</h1>
          <p className="text-[#727272] text-sm mt-1">
            <b className="text-[#1DB954]">발달</b> 검사입니다. 6개 영역(대근육·소근육·인지·언어·사회성·자조)을 문진표로 점검합니다.
            키·몸무게는 <Link href="/history" className="text-[#1DB954] font-bold hover:underline">📏 성장 기록</Link>에서 관리해요.
          </p>
        </div>

        <div className="bg-[#181818] rounded-2xl p-6 border border-[#1DB954]/30 space-y-4" style={{ boxShadow: '0 0 20px rgba(29,185,84,0.08)' }}>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <p className="text-[#727272] text-xs font-bold">{profile.name}의 현재 검진 차수</p>
              <h2 className="text-xl font-black text-white">{period.label}</h2>
            </div>
            <span className="bg-[#1DB954]/10 text-[#1DB954] text-xs font-bold px-3 py-1.5 rounded-full border border-[#1DB954]/30">
              문항 {period.questions.length}개 · 약 3~5분
            </span>
          </div>
          <button onClick={() => setMode('quiz')}
            className="w-full py-4 rounded-full bg-[#1DB954] text-black font-black text-lg hover:bg-[#1ed760] hover:scale-[1.02] transition-all"
            style={{ boxShadow: '0 0 20px rgba(29,185,84,0.3)' }}>
            진단 시작하기 →
          </button>
        </div>

        <div className="space-y-4">
          <h3 className="font-black text-white text-lg">📋 진단 이력 ({past.length}회)</h3>

          {past.length === 0 ? (
            <div className="bg-[#181818] rounded-2xl p-8 border border-[#282828] text-center text-[#727272] text-sm">
              아직 진단 기록이 없습니다. 첫 진단을 완료하면 영역별 발달 추이가 여기에 쌓입니다.
            </div>
          ) : (
            <>
              <div className="bg-[#181818] rounded-2xl p-5 border border-[#282828]">
                <h4 className="font-black text-white text-sm mb-1">영역별 발달 점수 추이</h4>
                <p className="text-xs text-[#727272] mb-3">진단할 때마다 점수가 누적되어 변화를 볼 수 있어요.</p>
                <GrowthLineChart history={chartRows} />
              </div>

              <div className="space-y-2.5">
                {[...past].reverse().map((r) => (
                  <button key={r.id} onClick={() => openPastResult(r)}
                    className="w-full text-left bg-[#181818] rounded-2xl p-4 border border-[#282828] hover:border-[#1DB954]/40 hover:bg-[#282828] transition-all flex items-center justify-between gap-3">
                    <div>
                      <div className="font-black text-white text-sm">생후 {r.ageMonths}개월 · KDST {r.kdstPeriod}차</div>
                      <div className="text-xs text-[#727272] mt-0.5">{formatDate(r.assessmentDate)} · 총점 {r.overallScore}/{r.overallMaxScore}</div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <LevelBadge level={r.overallLevel as DevelopmentLevel} />
                      <span className="text-[#1DB954] font-bold">→</span>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  /* ===================== 2) 문진 진행 ===================== */
  const currentQuestion = period.questions[currentIndex];
  const totalAnswered = Object.keys(responses).length;
  const allAnswered = totalAnswered === period.questions.length;
  const progressPercent = Math.round((totalAnswered / period.questions.length) * 100);

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-white">✏️ KDST 자가진단</h1>
          <p className="text-[#727272] text-sm mt-1">{period.label} | {profile.name} 엄마/아빠의 관찰 기준으로 평가해 주세요.</p>
        </div>
        <button onClick={() => setMode('intro')} className="text-xs text-[#727272] hover:text-white font-bold shrink-0 pt-1">✕ 나가기</button>
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
        <button onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))} disabled={currentIndex === 0}
          className="flex-1 py-3.5 rounded-full border-2 border-[#535353] text-[#b3b3b3] font-bold text-sm disabled:opacity-30 hover:border-white hover:text-white transition-all">
          ← 이전
        </button>
        {currentIndex < period.questions.length - 1 ? (
          <button onClick={() => setCurrentIndex((i) => i + 1)}
            className="flex-1 py-3.5 rounded-full bg-[#1DB954] text-black font-black text-sm hover:bg-[#1ed760] transition-all">
            다음 →
          </button>
        ) : (
          <button onClick={handleSubmit} disabled={submitting || !allAnswered}
            className="flex-1 py-3.5 rounded-full bg-[#1DB954] text-black font-black text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#1ed760] transition-all">
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
