'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DomainRadarChart } from '@/components/results/DomainRadarChart';
import { DomainScoreBar } from '@/components/results/DomainScoreBar';
import { LevelBadge } from '@/components/results/LevelBadge';
import { LEVEL_INFO, KDST_PERIODS, DOMAIN_LABELS } from '@/data/kdst';
import { formatDate } from '@/lib/age-calculator';
import type { AssessmentResult } from '@/types';
import Link from 'next/link';

// Red flag data per age range
const RED_FLAGS: Record<string, string[]> = {
  '0-6':   ['생후 2개월에 사회적 미소가 없음', '큰 소리에 전혀 반응이 없음', '눈 맞춤이 되지 않음'],
  '6-12':  ['생후 9개월에 표정, 소리, 몸짓으로 의사소통을 전혀 안 함', '낯가림이 전혀 없음', '이름을 불러도 전혀 반응 없음'],
  '12-24': ['"엄마", "아빠" 외 다른 단어가 12개월에 없음', '18개월에 의미 있는 단어가 없음', '24개월에 두 단어 조합이 없음', '눈 맞춤이 현저히 줄어듦'],
  '24-36': ['36개월에 낯선 사람도 대부분 알아들을 수 있는 문장을 못 함', '또래에 관심이 전혀 없음', '반복적이고 제한적인 행동이 매우 강하게 지속됨'],
  '36-60': ['혼자 계단을 못 오름', '이름, 성별을 모름', '4세에 간단한 이야기를 전달 못 함'],
};

function getRedFlags(ageMonths: number): string[] {
  if (ageMonths < 6) return RED_FLAGS['0-6'];
  if (ageMonths < 12) return RED_FLAGS['6-12'];
  if (ageMonths < 24) return RED_FLAGS['12-24'];
  if (ageMonths < 36) return RED_FLAGS['24-36'];
  return RED_FLAGS['36-60'];
}

// Play recommendations per age
const PLAY_RECS: Record<string, { title: string; desc: string; emoji: string }[]> = {
  '24-36': [
    { emoji: '🎭', title: '소꿉놀이', desc: '역할 놀이가 언어·인지·사회성을 동시에 자극합니다.' },
    { emoji: '🧩', title: '간단한 퍼즐 (2~4피스)', desc: '인지와 소근육을 동시에 발달시킵니다.' },
    { emoji: '📚', title: '하루 2권 그림책', desc: '"왜 그럴까?" 질문으로 언어 폭발을 유도하세요.' },
    { emoji: '🎵', title: '동요와 율동', desc: '리듬감과 신체 조정 능력을 키웁니다.' },
  ],
  '36-48': [
    { emoji: '🖍️', title: '자유로운 그림 그리기', desc: '소근육과 창의성을 동시에 키웁니다.' },
    { emoji: '🏗️', title: '블록/레고 조립', desc: '공간 인지와 집중력 발달에 탁월합니다.' },
    { emoji: '🌿', title: '자연 탐구 산책', desc: '"이게 뭐야?" 호기심을 자연에서 해결하세요.' },
    { emoji: '🎲', title: '간단한 보드게임', desc: '규칙 준수와 기다리기 연습에 최고입니다.' },
  ],
  '48-72': [
    { emoji: '✂️', title: '가위 오리기 놀이', desc: '소근육 발달과 성취감을 동시에 줍니다.' },
    { emoji: '🧪', title: '물/모래 탐구 놀이', desc: '과학적 호기심의 씨앗을 심어줍니다.' },
    { emoji: '🎭', title: '역할극 (의사, 요리사)', desc: '사회성과 언어 표현력이 폭발적으로 늘어납니다.' },
    { emoji: '🎵', title: '악기 탐구 (실로폰 등)', desc: '음악적 감수성과 청각 발달을 자극합니다.' },
  ],
};

function getPlayRecs(ageMonths: number) {
  if (ageMonths < 36) return PLAY_RECS['24-36'];
  if (ageMonths < 48) return PLAY_RECS['36-48'];
  return PLAY_RECS['48-72'];
}

// Adult height prediction (Khamis-Roche simplified)
function predictAdultHeight(currentHeight: number, ageMonths: number, gender: 'male' | 'female', fatherHeight: number, motherHeight: number): number {
  const midParent = gender === 'male'
    ? (fatherHeight + motherHeight + 13) / 2
    : (fatherHeight + motherHeight - 13) / 2;

  // Simple regression adjustment based on current percentile vs midparent
  // At age 3 (36mo), current height predicts ~50-60% of adult height variance
  const ageRatio = Math.min(1, ageMonths / 180); // 180 months = 15 years (almost adult)
  const predicted = midParent * (1 - ageRatio * 0.3) + currentHeight * (ageRatio * 0.3 + 0.1);
  return Math.round(predicted * 10) / 10;
}

export default function ResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [fatherHeight, setFatherHeight] = useState('');
  const [motherHeight, setMotherHeight] = useState('');
  const [predictedHeight, setPredictedHeight] = useState<number | null>(null);
  const [showPrediction, setShowPrediction] = useState(false);
  const [profile, setProfile] = useState<{ gender?: 'male' | 'female' } | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('latest_result');
    if (!stored) { router.push('/check'); return; }
    try { setResult(JSON.parse(stored)); } catch { router.push('/check'); }

    const profileStored = localStorage.getItem('ieye_profile');
    if (profileStored) setProfile(JSON.parse(profileStored));
  }, [router]);

  const handlePrint = () => window.print();

  const handlePredictHeight = () => {
    if (!result?.height || !fatherHeight || !motherHeight || !profile?.gender) return;
    const ph = predictAdultHeight(
      result.height,
      result.ageMonths,
      profile.gender,
      Number(fatherHeight),
      Number(motherHeight)
    );
    setPredictedHeight(ph);
  };

  if (!result) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="text-5xl animate-bounce">📊</div>
          <p className="text-[#b3b3b3] font-medium">결과 로딩 중...</p>
        </div>
      </div>
    );
  }

  const levelInfo = LEVEL_INFO[result.overallLevel];
  const period = KDST_PERIODS.find((p) => p.period === result.kdstPeriod);
  const redFlags = getRedFlags(result.ageMonths);
  const playRecs = getPlayRecs(result.ageMonths);

  const levelColorMap: Record<string, { border: string; bg: string; text: string; glow: string }> = {
    advanced: { border: '#1DB954', bg: 'rgba(29,185,84,0.08)', text: '#1DB954', glow: 'rgba(29,185,84,0.2)' },
    normal:   { border: '#1DB954', bg: 'rgba(29,185,84,0.05)', text: '#1DB954', glow: 'rgba(29,185,84,0.15)' },
    monitor:  { border: '#f59e0b', bg: 'rgba(245,158,11,0.08)', text: '#f59e0b', glow: 'rgba(245,158,11,0.2)' },
    evaluate: { border: '#ef4444', bg: 'rgba(239,68,68,0.08)', text: '#ef4444', glow: 'rgba(239,68,68,0.2)' },
  };
  const lc = levelColorMap[result.overallLevel];

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Print styles */}
      <style>{`
        @media print {
          body { background: white !important; color: black !important; }
          header, footer, .no-print { display: none !important; }
          .print-card { background: #f8f8f8 !important; border: 1px solid #ddd !important; color: black !important; }
        }
      `}</style>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">📊 진단 종합 리포트</h1>
          <p className="text-[#727272] text-sm mt-1">{period?.label} | {formatDate(result.assessmentDate)}</p>
        </div>
        <button
          onClick={handlePrint}
          className="no-print flex items-center space-x-2 bg-[#282828] hover:bg-[#383838] text-[#b3b3b3] hover:text-white px-4 py-2.5 rounded-full text-xs font-bold border border-[#383838] transition-all"
        >
          <span>🖨️</span>
          <span>PDF 저장</span>
        </button>
      </div>

      {/* Physical Growth Banner */}
      {result.heightPercentile !== undefined && result.weightPercentile !== undefined && (
        <div className="print-card bg-[#181818] rounded-2xl p-6 border border-[#1DB954]/30" style={{boxShadow: '0 0 20px rgba(29,185,84,0.1)'}}>
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-2xl">🌱</span>
            <h3 className="font-black text-[#1DB954] text-lg">신체 발육 상태</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#282828] rounded-xl p-4 text-center border border-[#383838]">
              <p className="text-[#727272] text-xs font-bold mb-2">키 ({result.height}cm)</p>
              <p className="text-[#1DB954] font-black text-3xl">상위 {100 - result.heightPercentile}%</p>
              <p className="text-[#535353] text-xs mt-2">또래 100명 중 {100 - result.heightPercentile}번째</p>
            </div>
            <div className="bg-[#282828] rounded-xl p-4 text-center border border-[#383838]">
              <p className="text-[#727272] text-xs font-bold mb-2">몸무게 ({result.weight}kg)</p>
              <p className="text-[#1DB954] font-black text-3xl">상위 {100 - result.weightPercentile}%</p>
              <p className="text-[#535353] text-xs mt-2">또래 100명 중 {100 - result.weightPercentile}번째</p>
            </div>
          </div>

          {/* Adult height prediction */}
          <div className="mt-4 border-t border-[#282828] pt-4">
            <button
              onClick={() => setShowPrediction(!showPrediction)}
              className="no-print text-xs text-[#1DB954] font-bold hover:text-[#1ed760] transition-colors"
            >
              📏 성인 예상 키 계산하기 {showPrediction ? '▲' : '▼'}
            </button>
            {showPrediction && (
              <div className="mt-3 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-[#727272] font-bold block mb-1">아빠 키 (cm)</label>
                    <input type="number" value={fatherHeight} onChange={e => setFatherHeight(e.target.value)} placeholder="예: 176" className="w-full bg-[#383838] border border-[#535353] rounded-xl p-2.5 text-white text-sm font-medium focus:border-[#1DB954] outline-none" />
                  </div>
                  <div>
                    <label className="text-xs text-[#727272] font-bold block mb-1">엄마 키 (cm)</label>
                    <input type="number" value={motherHeight} onChange={e => setMotherHeight(e.target.value)} placeholder="예: 163" className="w-full bg-[#383838] border border-[#535353] rounded-xl p-2.5 text-white text-sm font-medium focus:border-[#1DB954] outline-none" />
                  </div>
                </div>
                <button onClick={handlePredictHeight} disabled={!fatherHeight || !motherHeight} className="w-full py-2.5 rounded-full bg-[#1DB954]/20 text-[#1DB954] font-bold text-sm border border-[#1DB954]/30 hover:bg-[#1DB954]/30 disabled:opacity-40 transition-all">
                  계산하기
                </button>
                {predictedHeight && (
                  <div className="bg-[#1DB954]/10 border border-[#1DB954]/30 rounded-xl p-4 text-center">
                    <p className="text-[#727272] text-xs mb-1">예상 성인 키</p>
                    <p className="text-[#1DB954] font-black text-3xl">{predictedHeight} cm</p>
                    <p className="text-[#535353] text-xs mt-2">※ 부모 키 기반 통계적 추정치입니다.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Overall Level Banner */}
      <div className="print-card rounded-2xl p-6 text-center border-2" style={{ backgroundColor: lc.bg, borderColor: lc.border, boxShadow: `0 0 30px ${lc.glow}` }}>
        <div className="text-5xl mb-3">{levelInfo.emoji}</div>
        <LevelBadge level={result.overallLevel} large />
        <h2 className="mt-3 text-xl font-black" style={{ color: lc.text }}>{levelInfo.description}</h2>
        <p className="mt-2 text-sm font-medium text-[#b3b3b3]">{levelInfo.action}</p>
        <div className="mt-4 inline-block bg-[#121212]/60 rounded-xl px-5 py-2.5">
          <span className="text-[#727272] text-sm font-bold">종합 점수: </span>
          <span className="text-white font-black text-xl">{result.overallScore} / {result.overallMaxScore}점</span>
          <span className="text-[#535353] text-sm ml-1">({Math.round((result.overallScore / result.overallMaxScore) * 100)}%)</span>
        </div>
      </div>

      {/* 🚨 Red Flag Check */}
      <div className="print-card bg-[#181818] rounded-2xl p-5 border border-red-700/30">
        <div className="flex items-center space-x-2 mb-3">
          <span className="text-xl">🚨</span>
          <h3 className="font-black text-red-400">레드 플래그 체크</h3>
          <span className="text-xs text-[#727272]">— 아래 신호 중 하나라도 해당하면 전문가 상담 권장</span>
        </div>
        <div className="space-y-2">
          {redFlags.map((flag, i) => (
            <div key={i} className="flex items-start space-x-2 text-xs text-[#b3b3b3] bg-red-900/10 border border-red-700/20 rounded-xl p-2.5">
              <span className="text-red-500 font-black shrink-0">!</span>
              <span>{flag}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Radar Chart */}
      <div className="print-card bg-[#181818] rounded-2xl p-6 border border-[#282828]">
        <h3 className="font-black text-white mb-4">영역별 발달 레이더 차트</h3>
        <DomainRadarChart scores={result.domainScores} />
      </div>

      {/* Domain Scores */}
      <div className="print-card bg-[#181818] rounded-2xl p-6 border border-[#282828] space-y-4">
        <h3 className="font-black text-white">영역별 상세 분석</h3>
        {result.domainScores.map((score) => (
          <DomainScoreBar key={score.domain} score={score} />
        ))}
      </div>

      {/* 🎮 Play Recommendations */}
      <div className="print-card bg-[#181818] rounded-2xl p-5 border border-[#282828]">
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-xl">🎮</span>
          <h3 className="font-black text-white">이 시기 추천 발달 놀이</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {playRecs.map((rec, i) => (
            <div key={i} className="bg-[#282828] rounded-xl p-3 border border-[#383838]">
              <p className="text-2xl mb-1">{rec.emoji}</p>
              <p className="font-bold text-white text-sm">{rec.title}</p>
              <p className="text-[#727272] text-xs mt-1 leading-relaxed">{rec.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Domain Tips */}
      <div className="space-y-3">
        {result.domainScores
          .filter((s) => s.level === 'monitor' || s.level === 'evaluate')
          .map((score) => {
            const domainInfo = DOMAIN_LABELS.find((d) => d.key === score.domain)!;
            return (
              <div key={score.domain} className="print-card bg-[#181818] rounded-2xl p-5 border border-[#f59e0b]/30" style={{boxShadow: '0 0 15px rgba(245,158,11,0.05)'}}>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-xl">{domainInfo.emoji}</span>
                  <h4 className="font-black text-[#f59e0b]">{domainInfo.label} 영역 집중 권장</h4>
                </div>
                <p className="text-xs text-[#b3b3b3] leading-relaxed">
                  {domainInfo.description} 영역에서 보충이 필요합니다. 1~2주 내 관련 자극 활동을 늘려주세요.
                </p>
              </div>
            );
          })}
      </div>

      {/* CTA */}
      <div className="grid grid-cols-2 gap-3 pb-6 no-print">
        <Link href="/history" className="py-4 rounded-full bg-[#181818] border-2 border-[#535353] text-[#b3b3b3] font-bold text-sm text-center hover:border-[#1DB954] hover:text-[#1DB954] transition-all">
          📈 성장 기록 보기
        </Link>
        <Link href="/check" className="py-4 rounded-full bg-[#1DB954] text-black font-black text-sm text-center hover:bg-[#1ed760] transition-all" style={{boxShadow: '0 0 15px rgba(29,185,84,0.3)'}}>
          ✏️ 다시 진단하기
        </Link>
      </div>
    </div>
  );
}
