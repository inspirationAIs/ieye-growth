'use client';
import { useEffect, useState, useCallback } from 'react';
import { ChildProfileCard } from '@/components/home/ChildProfileCard';
import { SetupModal } from '@/components/home/SetupModal';
import { getMilestoneForAge } from '@/data/kdst';
import { formatAgeDetailed } from '@/lib/age-calculator';
import Link from 'next/link';

interface StoredProfile {
  id: string;
  name: string;
  birthdate: string;
  gender: 'female' | 'male';
  parentEmail: string;
}

export default function HomePage() {
  const [profile, setProfile] = useState<StoredProfile | null>(null);
  const [showSetup, setShowSetup] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('ieye_profile');
    if (stored) {
      try {
        setProfile(JSON.parse(stored));
      } catch {
        setShowSetup(true);
      }
    } else {
      setShowSetup(true);
    }
  }, []);

  const handleSetupComplete = useCallback(async (data: { name: string; birthdate: string; gender: 'female' | 'male'; parentEmail: string }) => {
    const newProfile: StoredProfile = {
      id: `child_${Date.now()}`,
      ...data,
    };

    localStorage.setItem('ieye_profile', JSON.stringify(newProfile));

    try {
      await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProfile),
      });
    } catch (e) {
      console.warn('Could not save to Google Sheets:', e);
    }

    setProfile(newProfile);
    setShowSetup(false);
  }, []);

  if (!mounted) return null;
  if (showSetup) return <SetupModal onComplete={handleSetupComplete} />;
  if (!profile) return null;

  const ageInfo = formatAgeDetailed(profile.birthdate);
  const milestone = getMilestoneForAge(ageInfo.ageMonths);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Child Profile Card */}
      <ChildProfileCard
        name={profile.name}
        birthdate={profile.birthdate}
        gender={profile.gender}
      />

      {/* Quick Action Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Link href="/check" className="group bg-[#181818] rounded-2xl p-5 border border-[#282828] hover:bg-[#282828] hover:border-[#1DB954]/40 transition-all duration-200">
          <div className="text-3xl mb-3">✏️</div>
          <h3 className="font-black text-white text-base leading-tight">KDST 진단</h3>
          <p className="text-[#727272] text-xs mt-1.5">{ageInfo.ageMonths}개월 맞춤 평가 시작</p>
          <div className="mt-3 text-[#1DB954] text-xs font-bold group-hover:translate-x-1 transition-transform">시작 →</div>
        </Link>
        <Link href="/milestones" className="group bg-[#181818] rounded-2xl p-5 border border-[#282828] hover:bg-[#282828] hover:border-[#1DB954]/40 transition-all duration-200">
          <div className="text-3xl mb-3">📘</div>
          <h3 className="font-black text-white text-base leading-tight">월령별 발달</h3>
          <p className="text-[#727272] text-xs mt-1.5">단계별 성장 기준표</p>
          <div className="mt-3 text-[#1DB954] text-xs font-bold group-hover:translate-x-1 transition-transform">보기 →</div>
        </Link>
        <Link href="/history" className="group bg-[#181818] rounded-2xl p-5 border border-[#282828] hover:bg-[#282828] hover:border-[#1DB954]/40 transition-all duration-200 col-span-2 sm:col-span-1">
          <div className="text-3xl mb-3">📈</div>
          <h3 className="font-black text-white text-base leading-tight">성장 기록</h3>
          <p className="text-[#727272] text-xs mt-1.5">누적 발달 성장 그래프</p>
          <div className="mt-3 text-[#1DB954] text-xs font-bold group-hover:translate-x-1 transition-transform">보기 →</div>
        </Link>
      </div>

      {/* Current Milestone Info */}
      {milestone && (
        <div className="bg-[#181818] rounded-2xl p-6 border border-[#282828] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-white text-lg">{milestone.label} 발달 가이드</h3>
            <span className="bg-[#1DB954]/10 text-[#1DB954] text-xs font-bold px-3 py-1.5 rounded-full border border-[#1DB954]/30">지금 단계</span>
          </div>

          {milestone.domains.slice(0, 3).map((d) => (
            <div key={d.domain} className="bg-[#282828] rounded-xl p-4 space-y-2 border border-[#383838]">
              <div className="font-bold text-sm text-[#1DB954]">🧠 {d.psychologicalNote}</div>
              <ul className="space-y-1">
                {d.milestones.map((m, i) => (
                  <li key={i} className="text-xs text-[#b3b3b3] flex items-start space-x-1.5">
                    <span className="text-[#1DB954] mt-0.5 font-bold">✓</span>
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Parenting Tips */}
          <div>
            <h4 className="font-bold text-[#b3b3b3] text-sm mb-2">💡 이시기 양육 팁</h4>
            <div className="space-y-2">
              {milestone.parentingTips.map((tip, i) => (
                <div key={i} className="flex items-start space-x-2 text-xs text-[#b3b3b3] bg-[#1DB954]/5 border border-[#1DB954]/20 rounded-xl p-3">
                  <span className="shrink-0 font-black text-[#1DB954]">{i + 1}.</span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Link */}
      <button
        onClick={() => setShowSetup(true)}
        className="w-full text-center text-xs text-[#535353] hover:text-[#1DB954] py-2 transition-colors"
      >
        프로필 수정하기
      </button>
    </div>
  );
}
