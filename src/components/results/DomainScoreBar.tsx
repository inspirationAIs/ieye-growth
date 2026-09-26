'use client';
import type { DomainScore } from '@/types';
import { DOMAIN_LABELS, LEVEL_INFO } from '@/data/kdst';

interface DomainScoreBarProps {
  score: DomainScore;
}

export function DomainScoreBar({ score }: DomainScoreBarProps) {
  const domainInfo = DOMAIN_LABELS.find((d) => d.key === score.domain)!;
  const levelInfo = LEVEL_INFO[score.level];

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-2 font-semibold text-slate-700">
          <span>{domainInfo.emoji}</span>
          <span>{domainInfo.label}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-slate-500 text-xs">{score.score}/{score.maxScore}점</span>
          <span
            className="px-2 py-0.5 rounded-full text-xs font-bold"
            style={{ backgroundColor: levelInfo.bgColor, color: levelInfo.textColor }}
          >
            {levelInfo.emoji} {levelInfo.label}
          </span>
        </div>
      </div>
      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${score.percentage}%`,
            backgroundColor: domainInfo.color,
          }}
        />
      </div>
    </div>
  );
}
