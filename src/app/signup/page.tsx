'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { validateSignup } from '@/lib/auth';
import { isCloudEnabled } from '@/lib/config';

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const invalid = validateSignup(userId.trim().toLowerCase(), email.trim(), password, confirm);
    if (invalid) { setError(invalid); return; }
    setLoading(true);
    try {
      await signup(userId, email, password);
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : '회원가입에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const input = 'w-full bg-[#282828] border-2 border-[#383838] rounded-xl p-4 font-medium text-white placeholder-[#535353] focus:border-[#1DB954] focus:outline-none transition-all';
  const label = 'block text-sm font-bold text-[#b3b3b3] mb-2';

  return (
    <div className="max-w-md mx-auto mt-6 space-y-6 animate-fade-in">
      <div className="text-center">
        <div className="text-5xl mb-3">✨</div>
        <h1 className="text-2xl font-black text-white">회원가입</h1>
        <p className="text-[#727272] text-sm mt-1">아이디와 이메일로 가입하고 기록을 계속 이어가세요.</p>
      </div>

      <form onSubmit={submit} className="bg-[#181818] rounded-2xl p-6 border border-[#282828] space-y-4">
        <div>
          <label className={label}>아이디</label>
          <input className={input} value={userId} onChange={(e) => setUserId(e.target.value)}
            placeholder="영문 소문자·숫자·_ 4~20자" autoComplete="username" required />
        </div>
        <div>
          <label className={label}>이메일</label>
          <input className={input} type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="example@gmail.com" autoComplete="email" required />
        </div>
        <div>
          <label className={label}>비밀번호</label>
          <input className={input} type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="8자 이상" autoComplete="new-password" required />
        </div>
        <div>
          <label className={label}>비밀번호 확인</label>
          <input className={input} type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)}
            placeholder="비밀번호 다시 입력" autoComplete="new-password" required />
        </div>

        {error && <div className="bg-red-900/30 border border-red-700/50 rounded-xl p-3 text-red-400 text-sm font-medium">{error}</div>}

        <button type="submit" disabled={loading}
          className="w-full py-4 rounded-full bg-[#1DB954] text-black font-black text-base hover:bg-[#1ed760] disabled:opacity-50 transition-all">
          {loading ? '가입 중...' : '가입하기'}
        </button>

        <p className="text-center text-sm text-[#727272]">
          이미 계정이 있으신가요?{' '}
          <Link href="/login" className="text-[#1DB954] font-bold hover:underline">로그인</Link>
        </p>
        <p className="text-center text-[11px] text-[#535353]">
          비밀번호는 브라우저에서 암호화(해시)된 뒤 전송되며, 원문은 어디에도 저장되지 않습니다.
          비밀번호 찾기 기능은 아직 제공되지 않으니 꼭 기억해 주세요.
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
