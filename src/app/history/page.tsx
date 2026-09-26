'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { GrowthLineChart } from '@/components/history/GrowthLineChart';
import { LevelBadge } from '@/components/results/LevelBadge';
import { formatDate } from '@/lib/age-calculator';
import type { SheetAssessmentRow, DevelopmentLevel } from '@/types';
import Link from 'next/link';

export default function HistoryPage() {
  const router = useRouter();
  const [history, setHistory] = useState<SheetAssessmentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('ieye_profile');
    if (!stored) { router.push('/'); return; }
    try {
      const profile = JSON.parse(stored);
      fetch(`/api/assessment?childId=${profile.id}`)
        .then((res) => res.json())
        .then((data) => {
          setHistory(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch(() => {
          setError('기록을 불러오는 중 오류가 발생했습니다.');
          setLoading(false);
        });
    } catch {
      router.push('/');
    }
  }, [router]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">📈 성장 기록</h1>
        <p className="text-slate-500 text-sm mt-1">KDST 진단를 반복할수록 아이의 성장 추이를 설딩할 수 있습니다.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="text-center space-y-2">
            <div className="text-4xl animate-bounce">📈</div>
            <p className="text-slate-500">기록 로딩 중...</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 text-rose-700 font-medium">{error}</div>
      ) : history.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 shadow-sm border border-slate-100 text-center space-y-4">
          <div className="text-5xl">🔔</div>
          <h3 className="font-extrabold text-slate-800 text-lg">아직 진단 기록이 없습니다</h3>
          <p className="text-slate-500 text-sm">첫 번째 KDST 진단을 시작해보세요!</p>
          <Link
            href="/check"
            className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-md hover:shadow-indigo-200 transition-all"
          >
            첫 진단 시작 →
          </Link>
        </div>
      ) : (
        <>
          {/* Growth Line Chart */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <h3 className="font-extrabold text-slate-900 mb-1">영역별 발달 성장 추이</h3>
            <p className="text-xs text-slate-500 mb-4">% 기준으로 영역별 점수 변화를 확인하세요</p>
            <GrowthLineChart history={history} />
          </div>

          {/* History List */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-700">\uc9c4\ub2e8 \uae30\ub85d \ubaa9\ub85d</h3>
            {[...history].reverse().map((row, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-extrabold text-slate-900">생후 {row.ageMonths}개월 KDST {row.period}차</div>
                    <div className="text-xs text-slate-400 mt-0.5">{formatDate(row.date)}</div>
                  </div>
                  <LevelBadge level={row.overallLevel as DevelopmentLevel} />
                </div>
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {[
                    { label: '\ub300\uadfc\uc721', score: row.grossMotor, max: 6 },
                    { label: '\uc18c\uadfc\uc721', score: row.fineMotor, max: 6 },
                    { label: '\uc778\uc9c0', score: row.cognition, max: 6 },
                    { label: '\uc5b8\uc5b4', score: row.language, max: 6 },
                    { label: '\uc0ac\ud68c\uc131', score: row.socialEmotional, max: 6 },
                    { label: '\uc790\uc870', score: row.selfHelp, max: 6 },
                  ].map((d) => (
                    <div key={d.label} className="bg-slate-50 rounded-xl p-2 text-center">
                      <div className="text-xs text-slate-500">{d.label}</div>
                      <div className="font-extrabold text-slate-900">{d.score}<span className="text-slate-400 font-normal text-xs">/{d.max}</span></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
