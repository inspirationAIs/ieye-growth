'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navItems = [
  { href: '/', label: '홈', icon: '🏠' },
  { href: '/milestones', label: '월령별 발달', icon: '📘' },
  { href: '/check', label: 'KDST 진단', icon: '✏️' },
  { href: '/vaccines', label: '예방접종', icon: '💉' },
  { href: '/temperament', label: '기질 검사', icon: '🧬' },
  { href: '/kindergarten', label: '유치원 정보', icon: '🏫' },
  { href: '/history', label: '성장 기록', icon: '📈' },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#000000]/90 backdrop-blur-xl border-b border-[#282828]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2.5 group shrink-0">
            <div className="w-9 h-9 rounded-full bg-[#1DB954] flex items-center justify-center text-black font-black text-lg shadow-lg group-hover:scale-105 transition-transform">
              🌱
            </div>
            <div className="hidden sm:block">
              <span className="font-black text-white text-sm leading-none tracking-tight">아이아이</span>
              <span className="block text-[9px] text-[#b3b3b3] leading-none font-medium tracking-widest uppercase mt-0.5">iEye Growth</span>
            </div>
          </Link>

          {/* Desktop nav - horizontally scrollable */}
          <nav className="hidden sm:flex items-center gap-1 overflow-x-auto scrollbar-hide flex-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-1 px-2.5 py-2 rounded-full text-[11px] font-bold transition-all whitespace-nowrap shrink-0 ${
                  pathname === item.href
                    ? 'bg-[#1DB954] text-black'
                    : 'text-[#b3b3b3] hover:text-white hover:bg-[#282828]'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            className="sm:hidden p-2 rounded-full text-[#b3b3b3] hover:text-white hover:bg-[#282828] transition-all"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="sm:hidden pb-3 grid grid-cols-2 gap-1.5 border-t border-[#282828] pt-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center space-x-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  pathname === item.href
                    ? 'bg-[#1DB954] text-black'
                    : 'text-[#b3b3b3] hover:text-white hover:bg-[#282828]'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
