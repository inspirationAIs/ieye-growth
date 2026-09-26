'use client';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { SheetAssessmentRow } from '@/types';
import { DOMAIN_LABELS } from '@/data/kdst';

interface GrowthLineChartProps {
  history: SheetAssessmentRow[];
}

export function GrowthLineChart({ history }: GrowthLineChartProps) {
  const data = history.map((row) => ({
    month: `${row.ageMonths}개월`,
    대근육: Math.round((row.grossMotor / 6) * 100),
    소근육: Math.round((row.fineMotor / 6) * 100),
    인지: Math.round((row.cognition / 6) * 100),
    언어: Math.round((row.language / 6) * 100),
    '사회성/정서': Math.round((row.socialEmotional / 6) * 100),
    자조: Math.round((row.selfHelp / 6) * 100),
  }));

  const lines = [
    { key: '대근육', color: '#6366f1' },
    { key: '소근육', color: '#8b5cf6' },
    { key: '인지', color: '#10b981' },
    { key: '언어', color: '#f59e0b' },
    { key: '사회성/정서', color: '#ef4444' },
    { key: '자조', color: '#14b8a6' },
  ];

  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} />
        <YAxis
          domain={[0, 100]}
          tick={{ fontSize: 11, fill: '#94a3b8' }}
          tickFormatter={(v) => `${v}%`}
        />
        <Tooltip
          formatter={(value: number, name: string) => [`${value}%`, name]}
          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: '12px' }}
        />
        <Legend wrapperStyle={{ fontSize: '11px' }} />
        {lines.map((line) => (
          <Line
            key={line.key}
            type="monotone"
            dataKey={line.key}
            stroke={line.color}
            strokeWidth={2.5}
            dot={{ r: 4, fill: line.color }}
            activeDot={{ r: 6 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
