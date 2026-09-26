'use client';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import type { DomainScore } from '@/types';
import { DOMAIN_LABELS } from '@/data/kdst';

interface DomainRadarChartProps {
  scores: DomainScore[];
}

export function DomainRadarChart({ scores }: DomainRadarChartProps) {
  const data = scores.map((s) => {
    const label = DOMAIN_LABELS.find((d) => d.key === s.domain)!;
    return {
      domain: label.label,
      score: s.percentage,
      fullMark: 100,
    };
  });

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart data={data}>
        <PolarGrid stroke="#e2e8f0" />
        <PolarAngleAxis
          dataKey="domain"
          tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
        />
        <Radar
          name="발달 수준"
          dataKey="score"
          stroke="#6366f1"
          fill="#6366f1"
          fillOpacity={0.25}
          strokeWidth={2}
        />
        <Tooltip
          formatter={(value: number) => [`${value}%`, '발달 수준']}
          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
