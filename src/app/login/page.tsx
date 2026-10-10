'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { isCloudEnabled } from '@/lib/config';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(identifier, password);
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : '로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const input = 'w-full bg-[#282828] border-2 border-[#383838] rounded-xl p-4 font-medium text-white placeholder-[#535353] focus:border-[#1DB954] focus:outline-none transition-all';

  return (
    <div className="max-w-md mx-auto mt-6 space-y-6 animate-fade-in">
      <div className="text-center">
        <div className="text-5xl mb-3">🌱</div>
        <h1 className="text-2xl font-black text-white">로그인</h1>
        <p className="text-[#727272] text-sm mt-1">로그인하면 진단·성장 기록이 계정에 계속 쌓입니다.</p>
      </div>

      <form onSubmit={submit} className="bg-[#181818] rounded-2xl p-6 border border-[#282828] space-y-4">
        <div>
          <label className="block text-sm font-bold text-[#b3b3b3] mb-2">아이디 또는 이메일</label>
          <input className={input} value={identifier} onChange={(e) => setIdentifier(e.target.value)}
            placeholder="아이디 또는 이메일 입력" autoComplete="username" required />
        </div>
        <div>
          <label className="block text-sm font-bold text-[#b3b3b3] mb-2">비밀번호</label>
          <input className={input} type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호 입력" autoComplete="current-password" required />
        </div>

        {error && <div className="bg-red-900/30 border border-red-700/50 rounded-xl p-3 text-red-400 text-sm font-medium">{error}</div>}

        <button type="submit" disabled={loading}
          className="w-full py-4 rounded-full bg-[#1DB954] text-black font-black text-base hover:bg-[#1ed760] disabled:opacity-50 transition-all">
          {loading ? '로그인 중...' : '로그인'}
        </button>

        <p className="text-center text-sm text-[#727272]">
          아직 계정이 없으신가요?{' '}
          <Link href="/signup" className="text-[#1DB954] font-bold hover:underline">회원가입</Link>
        </p>
      </form>

      {!isCloudEnabled() && (
        <p className="text-center text-xs text-[#f59e0b] bg-[#f59e0b]/5 border border-[#f59e0b]/20 rounded-xl p-3">
          ⚠️ 서버(구글 시트)가 아직 연결되지 않아 계정이 <b>이 기기·이 브라우저에서만</b> 유지됩니다.
        </p>
      )}
    </div>
  );
}
