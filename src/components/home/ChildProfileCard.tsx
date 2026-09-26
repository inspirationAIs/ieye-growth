'use client';
import { formatAgeDetailed, formatDate } from '@/lib/age-calculator';
import { getPeriodForAge } from '@/data/kdst';
import Link from 'next/link';

interface ChildProfileCardProps {
  name: string;
  birthdate: string;
  gender: 'female' | 'male';
}

export function ChildProfileCard({ name, birthdate, gender }: ChildProfileCardProps) {
  const ageInfo = formatAgeDetailed(birthdate);
  const period = getPeriodForAge(ageInfo.ageMonths);

  const genderEmoji = gender === 'female' ? '👧' : '👦';
  const genderLabel = gender === 'female' ? '여아' : '남아';

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a1a1a] via-[#1e2a1e] to-[#0f1f0f] p-6 text-white border border-[#1DB954]/20 spotify-glow">
      {/* Spotify green glow blobs */}
      <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-[#1DB954]/10 blur-3xl" />
      <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-[#1DB954]/5 blur-2xl" />

      <div className="relative z-10">
        {/* Profile Header */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-[#1DB954]/20 border-2 border-[#1DB954]/40 flex items-center justify-center text-4xl">
              {genderEmoji}
            </div>
            <div>
              <h2 className="text-3xl font-black tracking-tight">{name}</h2>
              <div className="flex items-center space-x-2 mt-1">
                <span className="bg-[#1DB954]/20 text-[#1DB954] px-2.5 py-0.5 rounded-full text-xs font-bold border border-[#1DB954]/30">{genderLabel}</span>
                <span className="text-[#b3b3b3] text-xs">{formatDate(birthdate)} 생</span>
              </div>
            </div>
          </div>
          <Link
            href="/check"
            className="bg-[#1DB954] text-black font-black text-sm px-5 py-2.5 rounded-full hover:bg-[#1ed760] hover:scale-105 transition-all spotify-glow-sm"
          >
            진단 시작 →
          </Link>
        </div>

        {/* Age Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[#000000]/40 rounded-xl p-3 text-center border border-[#282828]">
            <div className="text-2xl font-black text-[#1DB954]">{ageInfo.ageMonths}</div>
            <div className="text-[#727272] text-xs font-medium mt-0.5">생후 개월</div>
          </div>
          <div className="bg-[#000000]/40 rounded-xl p-3 text-center border border-[#282828]">
            <div className="text-xl font-black text-[#1DB954]">{ageInfo.ageDays.toLocaleString()}</div>
            <div className="text-[#727272] text-xs font-medium mt-0.5">생후 일수</div>
          </div>
          <div className="bg-[#000000]/40 rounded-xl p-3 text-center border border-[#282828]">
            <div className="text-lg font-black text-[#1DB954] leading-tight">만 {ageInfo.years}세<br/>{ageInfo.months}개월</div>
            <div className="text-[#727272] text-xs font-medium mt-0.5">만 나이</div>
          </div>
        </div>

        {/* Current KDST Period Badge */}
        {period && (
          <div className="mt-4 flex items-center space-x-3 bg-[#000000]/40 rounded-xl p-3 border border-[#282828]">
            <span className="text-xl">📊</span>
            <div>
              <div className="font-bold text-sm text-white">KDST {period.label}</div>
              <div className="text-[#727272] text-xs">현재 검진 주기 | {period.questions.length}개 항목 평가</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
