'use client';
import { useState } from 'react';
import { TEMPERAMENT_QUESTIONS, TRAIT_INFO, calculateTemperament } from '@/data/temperament';
import type { TemperamentTrait } from '@/data/temperament';

const SCORE_LABELS = ['전혀 아님', '가끔 그럼', '자주 그럼', '항상 그럼'];

export default function TemperamentPage() {
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [result, setResult] = useState<Record<TemperamentTrait, number> | null>(null);
  const [currentQ, setCurrentQ] = useState(0);

  const answered = Object.keys(responses).length;
  const allAnswered = answered === TEMPERAMENT_QUESTIONS.length;

  const handleScore = (id: string, score: number) => {
    setResponses(prev => ({ ...prev, [id]: score }));
    if (currentQ < TEMPERAMENT_QUESTIONS.length - 1) {
      setTimeout(() => setCurrentQ(q => q + 1), 300);
    }
  };

  const handleSubmit = () => {
    const scores = calculateTemperament(responses);
    setResult(scores);
  };

  if (result) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-black text-white">🧬 기질 분석 결과</h1>
          <p className="text-[#727272] text-sm mt-1">우리 아이만의 타고난 기질 지도입니다.</p>
        </div>

        {TRAIT_INFO.map(trait => {
          const score = result[trait.key];
          const isHigh = score >= 55;
          const traitLabel = isHigh ? trait.highLabel : trait.lowLabel;
          const tips = isHigh ? trait.highParentingTip : trait.lowParentingTip;

          return (
            <div key={trait.key} className="bg-[#181818] rounded-2xl p-5 border border-[#282828] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">{trait.emoji}</span>
                  <span className="font-black text-white">{trait.label}</span>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                  isHigh ? 'bg-[#1DB954]/10 text-[#1DB954] border-[#1DB954]/30' : 'bg-[#282828] text-[#b3b3b3] border-[#383838]'
                }`}>
                  {traitLabel}
                </span>
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex justify-between text-xs text-[#535353] mb-1">
                  <span>낮음</span>
                  <span className={`font-bold ${isHigh ? 'text-[#1DB954]' : 'text-[#b3b3b3]'}`}>{score}%</span>
                  <span>높음</span>
                </div>
                <div className="h-2 bg-[#282828] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${isHigh ? 'bg-[#1DB954]' : 'bg-[#535353]'}`}
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>

              {/* Parenting tips */}
              <div className="space-y-1.5">
                <p className="text-[#727272] text-xs font-bold">💡 맞춤 양육 팁</p>
                {tips.map((tip, i) => (
                  <div key={i} className="flex items-start space-x-2 text-xs text-[#b3b3b3] bg-[#1DB954]/5 border border-[#1DB954]/10 rounded-xl p-2.5">
                    <span className="text-[#1DB954] font-black shrink-0">{i + 1}.</span>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        <button
          onClick={() => { setResult(null); setResponses({}); setCurrentQ(0); }}
          className="w-full py-3.5 rounded-full border-2 border-[#535353] text-[#b3b3b3] font-bold hover:border-[#1DB954] hover:text-[#1DB954] transition-all"
        >
          다시 검사하기
        </button>
      </div>
    );
  }

  const q = TEMPERAMENT_QUESTIONS[currentQ];
  const progress = Math.round((answered / TEMPERAMENT_QUESTIONS.length) * 100);

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black text-white">🧬 기질 맞춤 육아 가이드</h1>
        <p className="text-[#727272] text-sm mt-1">아이의 타고난 기질을 파악하고, 기질에 맞는 맞춤 양육 팁을 확인하세요.</p>
      </div>

      {/* Progress */}
      <div className="bg-[#181818] rounded-2xl p-4 border border-[#282828] space-y-2">
        <div className="flex justify-between text-xs font-bold">
          <span className="text-[#727272]">진행률</span>
          <span className="text-[#1DB954]">{answered} / {TEMPERAMENT_QUESTIONS.length} 완료</span>
        </div>
        <div className="h-1.5 bg-[#282828] rounded-full overflow-hidden">
          <div className="h-full bg-[#1DB954] rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Current Question */}
      <div className="bg-[#181818] rounded-2xl p-6 border border-[#282828] space-y-6">
        <div>
          <p className="text-[#727272] text-xs font-bold mb-2">질문 {currentQ + 1} / {TEMPERAMENT_QUESTIONS.length}</p>
          <p className="text-white font-black text-lg leading-relaxed">{q.text}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {SCORE_LABELS.map((label, score) => (
            <button
              key={score}
              onClick={() => handleScore(q.id, score)}
              className={`py-4 px-3 rounded-2xl border-2 text-sm font-bold transition-all ${
                responses[q.id] === score
                  ? 'bg-[#1DB954]/10 border-[#1DB954] text-[#1DB954]'
                  : 'border-[#383838] text-[#b3b3b3] hover:border-[#535353] hover:text-white bg-[#282828]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Nav buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => setCurrentQ(q => Math.max(0, q - 1))}
          disabled={currentQ === 0}
          className="flex-1 py-3.5 rounded-full border-2 border-[#535353] text-[#b3b3b3] font-bold disabled:opacity-30 hover:border-white hover:text-white transition-all"
        >
          ← 이전
        </button>
        {currentQ < TEMPERAMENT_QUESTIONS.length - 1 ? (
          <button
            onClick={() => setCurrentQ(q => q + 1)}
            className="flex-1 py-3.5 rounded-full bg-[#282828] text-[#b3b3b3] font-bold hover:bg-[#383838] transition-all"
          >
            다음 →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className="flex-1 py-3.5 rounded-full bg-[#1DB954] text-black font-black disabled:opacity-40 hover:bg-[#1ed760] transition-all"
            style={allAnswered ? {boxShadow: '0 0 20px rgba(29,185,84,0.3)'} : {}}
          >
            결과 보기 →
          </button>
        )}
      </div>
    </div>
  );
}
