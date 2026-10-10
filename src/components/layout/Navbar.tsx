'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';

const navItems = [
  { href: '/', label: '홈', icon: '🏠' },
  { href: '/milestones', label: '월령별 발달', icon: '📘' },
  { href: '/check', label: 'KDST 자가진단', icon: '✏️' },
  { href: '/history', label: '성장 기록', icon: '📏' },
  { href: '/vaccines', label: '예방접종', icon: '💉' },
  { href: '/temperament', label: '기질 검사', icon: '🧬' },
  { href: '/kindergarten', label: '유치원 정보', icon: '🏫' },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { session, ready, syncState, logout } = useAuth();

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  const handleLogout = async () => {
    setMobileOpen(false);
    await logout();
    router.push('/');
    router.refresh();
  };

  const syncLabel =
    syncState === 'syncing' ? '저장 중…' : syncState === 'error' ? '저장 실패' : syncState === 'ok' ? '저장됨 ✓' : '';

  const AuthButtons = ({ mobile = false }: { mobile?: boolean }) => {
    if (!ready) return null;
    if (session) {
      return (
        <div className={`flex items-center gap-2 ${mobile ? 'col-span-2 justify-between px-1' : 'shrink-0'}`}>
          <div className="text-right leading-tight">
            <div className="text-[11px] font-black text-white">{session.userId}님</div>
            {syncLabel && (
              <div className={`text-[9px] font-bold ${syncState === 'error' ? 'text-red-400' : 'text-[#1DB954]'}`}>{syncLabel}</div>
            )}
          </div>
          <button onClick={handleLogout}
            className="px-3 py-1.5 rounded-full border border-[#535353] text-[11px] font-bold text-[#b3b3b3] hover:text-white hover:border-white transition-all">
            로그아웃
          </button>
        </div>
      );
    }
    return (
      <div className={`flex items-center gap-1.5 ${mobile ? 'col-span-2' : 'shrink-0'}`}>
        <Link href="/login" onClick={() => setMobileOpen(false)}
          className="px-3 py-1.5 rounded-full text-[11px] font-bold text-[#b3b3b3] hover:text-white transition-all">
          로그인
        </Link>
        <Link href="/signup" onClick={() => setMobileOpen(false)}
          className="px-3.5 py-1.5 rounded-full bg-white text-black text-[11px] font-black hover:scale-105 transition-transform">
          회원가입
        </Link>
      </div>
    );
  };

  return (
    <header className="sticky top-0 z-50 bg-[#000000]/90 backdrop-blur-xl border-b border-[#282828]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link href="/" className="flex items-center space-x-2.5 group shrink-0">
            <div className="w-9 h-9 rounded-full bg-[#1DB954] flex items-center justify-center text-black font-black text-lg shadow-lg group-hover:scale-105 transition-transform">
              🌱
            </div>
            <div className="hidden sm:block">
              <span className="font-black text-white text-sm leading-none tracking-tight">아이아이</span>
              <span className="block text-[9px] text-[#b3b3b3] leading-none font-medium tracking-widest uppercase mt-0.5">iEye Growth</span>
            </div>
          </Link>

          <nav className="hidden sm:flex items-center gap-1 overflow-x-auto scrollbar-hide flex-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-1 px-2.5 py-2 rounded-full text-[11px] font-bold transition-all whitespace-nowrap shrink-0 ${
                  isActive(item.href) ? 'bg-[#1DB954] text-black' : 'text-[#b3b3b3] hover:text-white hover:bg-[#282828]'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="hidden sm:block">
            <AuthButtons />
          </div>

          <button
            className="sm:hidden p-2 rounded-full text-[#b3b3b3] hover:text-white hover:bg-[#282828] transition-all"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>

        {mobileOpen && (
          <div className="sm:hidden pb-3 grid grid-cols-2 gap-1.5 border-t border-[#282828] pt-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center space-x-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive(item.href) ? 'bg-[#1DB954] text-black' : 'text-[#b3b3b3] hover:text-white hover:bg-[#282828]'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
            <AuthButtons mobile />
          </div>
        )}
      </div>
    </header>
  );
}
