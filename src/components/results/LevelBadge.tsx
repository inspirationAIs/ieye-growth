import type { DevelopmentLevel } from '@/types';
import { LEVEL_INFO } from '@/data/kdst';

interface LevelBadgeProps {
  level: DevelopmentLevel;
  large?: boolean;
}

export function LevelBadge({ level, large = false }: LevelBadgeProps) {
  const info = LEVEL_INFO[level];

  return (
    <div
      className={`inline-flex items-center space-x-1.5 rounded-2xl border-2 font-extrabold ${
        large ? 'px-5 py-2.5 text-base' : 'px-3 py-1.5 text-sm'
      }`}
      style={{
        backgroundColor: info.bgColor,
        borderColor: info.borderColor,
        color: info.textColor,
      }}
    >
      <span className={large ? 'text-2xl' : 'text-lg'}>{info.emoji}</span>
      <span>{info.label}</span>
    </div>
  );
}
