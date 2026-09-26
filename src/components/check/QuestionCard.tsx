'use client';
import type { KDSTQuestion } from '@/types';
import { DOMAIN_LABELS } from '@/data/kdst';

interface QuestionCardProps {
  question: KDSTQuestion;
  questionNumber: number;
  total: number;
  currentScore: number | undefined;
  onScore: (questionId: string, score: number) => void;
}

const SCORE_OPTIONS = [
  { value: 0, label: '전혀 못함', emoji: '😢', color: 'border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100' },
  { value: 1, label: '노력하면 조금', emoji: '😕', color: 'border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100' },
  { value: 2, label: '어느 정도 함', emoji: '🙂', color: 'border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100' },
  { value: 3, label: '잘 함', emoji: '😄', color: 'border-emerald-400 bg-emerald-50 text-emerald-700 hover:bg-emerald-100' },
];

export function QuestionCard({ question, questionNumber, total, currentScore, onScore }: QuestionCardProps) {
  const domainInfo = DOMAIN_LABELS.find((d) => d.key === question.domain)!;

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 space-y-5">
      {/* Domain Badge + Progress */}
      <div className="flex items-center justify-between">
        <div
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-sm"
          style={{ backgroundColor: domainInfo.color }}
        >
          <span>{domainInfo.emoji}</span>
          <span>{domainInfo.label}</span>
        </div>
        <span className="text-xs text-slate-400 font-semibold">{questionNumber} / {total}</span>
      </div>

      {/* Question */}
      <div>
        <p className="text-slate-900 font-bold text-lg leading-snug">{question.text}</p>
        {question.tip && (
          <div className="mt-2 flex items-start space-x-1.5 text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl">
            <span>💡</span>
            <span>{question.tip}</span>
          </div>
        )}
      </div>

      {/* Score Options */}
      <div className="grid grid-cols-2 gap-2.5">
        {SCORE_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => onScore(question.id, option.value)}
            className={`p-3.5 rounded-2xl border-2 text-center transition-all font-bold text-sm ${
              currentScore === option.value
                ? option.color + ' ring-2 ring-offset-1 scale-[1.02] shadow-sm ' + option.color.split(' ')[0].replace('border-', 'ring-')
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
            }`}
          >
            <div className="text-2xl mb-1">{option.emoji}</div>
            <div className="text-xs">{option.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
