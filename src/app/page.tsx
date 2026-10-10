'use client';
import { useEffect, useState, useCallback } from 'react';
import { ChildProfileCard } from '@/components/home/ChildProfileCard';
import { SetupModal } from '@/components/home/SetupModal';
import { getMilestoneForAge } from '@/data/kdst';
import { formatAgeDetailed } from '@/lib/age-calculator';
import Link from 'next/link';
import { saveProfile } from '@/lib/storage';
import { useAuth } from '@/components/auth/AuthProvider';

interface StoredProfile {
  id: string;
  name: string;
  birthdate: string;
  gender: 'female' | 'male';
  parentEmail: string;
}

export default function HomePage() {
  const { session, ready } = useAuth();
  const [profile, setProfile] = useState<StoredProfile | null>(null);
  const [showSetup, setShowSetup] = useState(false);

  useEffect(() => {
    if (!ready) return;

    if (session) {
      // Logged in: Check for profile
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
    } else {
      // Not logged in: Clear profile and setup state
      setProfile(null);
      setShowSetup(false);
    }
  }, [ready, session]);

  const handleSetupComplete = useCallback(async (data: { name: string; birthdate: string; gender: 'female' | 'male'; parentEmail: string }) => {
    const newProfile: StoredProfile = {
      id: profile?.id ?? `child_${Date.now()}`,
      ...data,
    };

    saveProfile(newProfile); // 저장 + (로그인 상태면) 계정에 자동 저장
    setProfile(newProfile);
    setShowSetup(false);
  }, [profile]);

  if (!ready) return null; // 로딩 중

  // 1. 로그인 안 된 상태 (랜딩/로그인 요구 화면)
  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 animate-fade-in text-center px-4">
        <div className="w-20 h-20 bg-[#282828] rounded-full flex items-center justify-center border border-[#1DB954]/20 mb-4 shadow-lg shadow-[#1DB954]/10">
          <span className="text-4xl">🌱</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
          우리아이 발달, <br />
          <span className="text-[#1DB954]">안전하게 기록하고 확인하세요</span>
        </h1>
        <p className="text-[#b3b3b3] text-sm">
          로그인 후 아이의 정보를 입력하면,<br />
          언제 어디서나 성장 기록과 발달 진단을 확인할 수 있어요.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 pt-6 w-full max-w-xs">
          <Link href="/login" className="w-full text-center px-6 py-3.5 rounded-full bg-[#1DB954] text-black text-sm font-black hover:bg-[#1ed760] transition-all">
            로그인
          </Link>
          <Link href="/signup" className="w-full text-center px-6 py-3.5 rounded-full border border-[#535353] text-[#b3b3b3] text-sm font-bold hover:text-white hover:border-white transition-all">
            회원가입
          </Link>
        </div>
      </div>
    );
  }

  // 2. 로그인되었으나 아이 정보가 없는 상태
  if (showSetup) {
    return <SetupModal onComplete={handleSetupComplete} />;
  }

  // 3. 아이 정보 로딩 대기
  if (!profile) return null;

  // 4. 메인 대시보드
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
          <h3 className="font-black text-white text-base leading-tight">KDST 자가진단</h3>
          <p className="text-[#727272] text-xs mt-1.5">발달 검사 · {ageInfo.ageMonths}개월 문진표와 진단 이력</p>
          <div className="mt-3 text-[#1DB954] text-xs font-bold group-hover:translate-x-1 transition-transform">시작 →</div>
        </Link>
        <Link href="/milestones" className="group bg-[#181818] rounded-2xl p-5 border border-[#282828] hover:bg-[#282828] hover:border-[#1DB954]/40 transition-all duration-200">
          <div className="text-3xl mb-3">📘</div>
          <h3 className="font-black text-white text-base leading-tight">월령별 발달</h3>
          <p className="text-[#727272] text-xs mt-1.5">단계별 발달 기준표</p>
          <div className="mt-3 text-[#1DB954] text-xs font-bold group-hover:translate-x-1 transition-transform">보기 →</div>
        </Link>
        <Link href="/history" className="group bg-[#181818] rounded-2xl p-5 border border-[#282828] hover:bg-[#282828] hover:border-[#1DB954]/40 transition-all duration-200 col-span-2 sm:col-span-1">
          <div className="text-3xl mb-3">📏</div>
          <h3 className="font-black text-white text-base leading-tight">성장 기록</h3>
          <p className="text-[#727272] text-xs mt-1.5">신체 측정 · 키·몸무게 백분위와 그래프</p>
          <div className="mt-3 text-[#1DB954] text-xs font-bold group-hover:translate-x-1 transition-transform">기록하기 →</div>
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

