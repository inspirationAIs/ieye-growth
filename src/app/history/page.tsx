'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { GrowthLineChart } from '@/components/history/GrowthLineChart';
import { LevelBadge } from '@/components/results/LevelBadge';
import { formatDate } from '@/lib/age-calculator';
import type { SheetAssessmentRow, DevelopmentLevel, AssessmentResult } from '@/types';
import Link from 'next/link';

export default function HistoryPage() {
  const router = useRouter();
  const [history, setHistory] = useState<SheetAssessmentRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('ieye_profile');
    if (!stored) { router.push('/'); return; }
    try {
      const profile = JSON.parse(stored);
      const historyKey = `ieye_history_${profile.id}`;
      const saved = localStorage.getItem(historyKey);
      if (saved) {
        const parsed: AssessmentResult[] = JSON.parse(saved);
        const rows: SheetAssessmentRow[] = parsed.map(r => {
          const domainMap = new Map((r.domainScores || []).map(d => [d.domain, d.score]));
          return {
            date: r.assessmentDate,
            ageMonths: r.ageMonths,
            period: r.kdstPeriod,
            grossMotor: domainMap.get('grossMotor') ?? 0,
            fineMotor: domainMap.get('fineMotor') ?? 0,
            cognition: domainMap.get('cognition') ?? 0,
            language: domainMap.get('language') ?? 0,
            socialEmotional: domainMap.get('socialEmotional') ?? 0,
            selfHelp: domainMap.get('selfHelp') ?? 0,
            totalScore: r.overallScore || 0,
            overallLevel: r.overallLevel || 'normal',
            notes: '',
          };
        });
        setHistory(rows);
      }
      setLoading(false);
    } catch {
      setLoading(false);
    }
  }, [router]);

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-white">📈 성장 기록</h1>
        <p className="text-[#727272] text-sm mt-1">KDST 진단을 반복할수록 아이의 영역별 성장 추이를 한눈에 볼 수 있습니다.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="text-center space-y-2">
            <div className="text-4xl animate-bounce">📈</div>
            <p className="text-[#b3b3b3]">기록 로딩 중...</p>
          </div>
        </div>
      ) : history.length === 0 ? (
        <div className="bg-[#181818] rounded-3xl p-10 border border-[#282828] text-center space-y-4">
          <div className="text-5xl">🌱</div>
          <h3 className="font-black text-white text-lg">아직 저장된 진단 기록이 없습니다</h3>
          <p className="text-[#727272] text-sm">첫 번째 KDST 진단을 완료하면 누적 발달 차트가 생성됩니다.</p>
          <Link
            href="/check"
            className="inline-block px-6 py-3 bg-[#1DB954] text-black font-black rounded-full hover:bg-[#1ed760] transition-all"
          >
            첫 진단 시작하기 →
          </Link>
        </div>
      ) : (
        <>
          <div className="bg-[#181818] rounded-3xl p-6 border border-[#282828]">
            <h3 className="font-black text-white mb-1">영역별 발달 성장 추이</h3>
            <p className="text-xs text-[#727272] mb-4">% 기준으로 영역별 점수 변화를 확인하세요</p>
            <GrowthLineChart history={history} />
          </div>

          <div className="space-y-3">
            <h3 className="font-black text-white">진단 기록 목록 ({history.length}회)</h3>
            {[...history].reverse().map((row, i) => (
              <div key={i} className="bg-[#181818] rounded-2xl p-5 border border-[#282828]">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-black text-white text-base">생후 {row.ageMonths}개월 · KDST {row.period}차</div>
                    <div className="text-xs text-[#727272] mt-0.5">{formatDate(row.date)}</div>
                  </div>
                  <LevelBadge level={row.overallLevel as DevelopmentLevel} />
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-4">
                  {[
                    { label: '대근육', score: row.grossMotor, max: 6 },
                    { label: '소근육', score: row.fineMotor, max: 6 },
                    { label: '인지', score: row.cognition, max: 6 },
                    { label: '언어', score: row.language, max: 6 },
                    { label: '사회성', score: row.socialEmotional, max: 6 },
                    { label: '자조', score: row.selfHelp, max: 6 },
                  ].map((d) => (
                    <div key={d.label} className="bg-[#282828] rounded-xl p-2.5 text-center border border-[#383838]">
                      <div className="text-xs text-[#727272] font-bold">{d.label}</div>
                      <div className="font-black text-white text-sm mt-0.5">{d.score}<span className="text-[#535353] font-normal text-xs">/{d.max}</span></div>
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
