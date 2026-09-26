import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import './globals.css';

export const metadata: Metadata = {
  title: '아이아이 (iEye Growth) - KDST 기반 영유아 발달 추적',
  description: 'KDST(한국 영유아 발달선별검사) 기반으로 월령별 아이의 발달을 상세히 추적하고 맞춤 양육 가이드를 제공하는 서비스입니다.',
  keywords: ['영유아검진', 'KDST', '아이발달', '월령별발달', '영유아검진'],
  openGraph: {
    title: '아이아이 (iEye Growth)',
    description: 'KDST 기반 영유아 발달 선별 및 양육 가이드 서비스',
    locale: 'ko_KR',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#121212] antialiased">
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          {children}
        </main>
        <footer className="border-t border-[#282828] bg-[#0a0a0a] mt-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-[#b3b3b3]">
              <div className="flex items-center space-x-2">
                <span className="text-[#1DB954] font-black text-lg">●</span>
                <span className="font-bold text-white">아이아이 (iEye Growth)</span>
              </div>
              <p className="text-xs text-center text-[#727272]">
                본 서비스는 KDST 표준 가이드라인 기반 자가선별 도구이며, 의료적 진단을 대신할 수 없습니다.
              </p>
              <p className="text-[#727272] text-xs">© 2024 iEye Growth</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
