'use client';
import { useEffect, useState } from 'react';
import { getVaccineSchedule } from '@/data/vaccines';
import type { VaccineDoseStatus } from '@/data/vaccines';

function formatDate(d: Date) {
  return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function VaccinesPage() {
  const [schedule, setSchedule] = useState<VaccineDoseStatus[]>([]);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'overdue' | 'done'>('all');

  useEffect(() => {
    const stored = localStorage.getItem('ieye_profile');
    if (stored) {
      const profile = JSON.parse(stored);
      setSchedule(getVaccineSchedule(profile.birthdate));
    }
  }, []);

  const filtered = filter === 'all' ? schedule : schedule.filter(s => s.status === filter);
  const upcomingCount = schedule.filter(s => s.status === 'upcoming' && s.daysFromNow <= 60).length;
  const overdueCount = schedule.filter(s => s.status === 'overdue').length;

  const statusConfig = {
    done:     { label: '완료', bg: 'bg-[#282828]', text: 'text-[#727272]', border: 'border-[#383838]', dot: 'bg-[#535353]' },
    upcoming: { label: '예정', bg: 'bg-[#1DB954]/5',  text: 'text-[#1DB954]', border: 'border-[#1DB954]/30', dot: 'bg-[#1DB954]' },
    overdue:  { label: '지연', bg: 'bg-red-900/20', text: 'text-red-400', border: 'border-red-700/40', dot: 'bg-red-500' },
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-white">💉 예방접종 스케줄</h1>
        <p className="text-[#727272] text-sm mt-1">질병관리청 국가예방접종 일정을 아이 생년월일 기준으로 자동 계산합니다.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[#181818] rounded-2xl p-4 text-center border border-[#282828]">
          <p className="text-3xl font-black text-[#1DB954]">{overdueCount}</p>
          <p className="text-[#727272] text-xs mt-1 font-bold">접종 지연</p>
        </div>
        <div className="bg-[#181818] rounded-2xl p-4 text-center border border-[#282828]">
          <p className="text-3xl font-black text-[#f59e0b]">{upcomingCount}</p>
          <p className="text-[#727272] text-xs mt-1 font-bold">60일 이내 예정</p>
        </div>
        <div className="bg-[#181818] rounded-2xl p-4 text-center border border-[#282828]">
          <p className="text-3xl font-black text-[#535353]">{schedule.filter(s => s.status === 'done').length}</p>
          <p className="text-[#727272] text-xs mt-1 font-bold">완료 추정</p>
        </div>
      </div>

      {overdueCount > 0 && (
        <div className="bg-red-900/20 border border-red-700/40 rounded-2xl p-4 flex items-start space-x-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <p className="font-black text-red-400 text-sm">접종 지연 알림</p>
            <p className="text-red-300/80 text-xs mt-1">
              {overdueCount}건의 접종이 권장 시기를 지났습니다. 소아과에 방문하여 확인해 주세요.
            </p>
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        {(['all', 'overdue', 'upcoming', 'done'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              filter === f ? 'bg-[#1DB954] text-black' : 'bg-[#282828] text-[#b3b3b3] hover:bg-[#383838]'
            }`}>
            {f === 'all' ? '전체' : f === 'overdue' ? '⚠️ 지연' : f === 'upcoming' ? '📅 예정' : '✓ 완료'}
          </button>
        ))}
      </div>

      {/* Vaccine List */}
      <div className="space-y-3">
        {filtered.map((item, i) => {
          const cfg = statusConfig[item.status];
          const isNear = item.status === 'upcoming' && item.daysFromNow <= 30;
          return (
            <div key={i} className={`rounded-2xl p-4 border ${cfg.bg} ${cfg.border}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${cfg.dot} ${isNear ? 'animate-pulse' : ''}`} />
                  <div>
                    <p className="font-black text-white text-sm">
                      {item.vaccine.name} <span className="text-[#727272] font-normal">{item.dose.label}</span>
                    </p>
                    <p className="text-[#727272] text-xs">{item.vaccine.disease}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${cfg.text} bg-black/20`}>
                    {cfg.label}
                  </span>
                  <p className={`text-xs mt-1 font-bold ${cfg.text}`}>
                    {item.status === 'done' ? formatDate(item.dueDate) :
                     item.status === 'overdue' ? `${Math.abs(item.daysFromNow)}일 경과` :
                     item.daysFromNow === 0 ? '오늘!' : `D-${item.daysFromNow}`}
                  </p>
                </div>
              </div>
              {item.status !== 'done' && (
                <p className="text-[#535353] text-xs mt-2 pl-5">📅 권장일: {formatDate(item.dueDate)} ({item.dose.ageLabel})</p>
              )}
            </div>
          );
        })}
      </div>

      <div className="bg-[#181818] rounded-2xl p-4 border border-[#282828]">
        <p className="text-[#535353] text-xs leading-relaxed">
          ※ 본 일정은 질병관리청 표준 일정 기반의 <strong className="text-[#727272]">자동 계산 결과</strong>이며, 
          실제 접종 기록과 다를 수 있습니다. 반드시 담당 소아과 의사와 상담하세요.
          완료 여부는 생년월일 기반으로 추정됩니다.
        </p>
      </div>
    </div>
  );
}
