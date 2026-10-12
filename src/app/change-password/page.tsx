'use client';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';

function ChangePasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { session, ready, changePassword, resetPassword } = useAuth();

  const [mode, setMode] = useState<'change' | 'reset'>('change');

  // 변경 모드 (로그인 상태)
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // 재설정 모드 (비밀번호 분실 시)
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [resetConfirmPassword, setResetConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'reset' || (!session && ready)) {
      setMode('reset');
    } else if (session) {
      setMode('change');
    }
  }, [searchParams, session, ready]);

  const handleChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword.length < 8) {
      setError('새 비밀번호는 8자 이상이어야 합니다.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('새 비밀번호 확인이 일치하지 않습니다.');
      return;
    }
    if (currentPassword === newPassword) {
      setError('새 비밀번호는 현재 비밀번호와 달라야 합니다.');
      return;
    }

    setLoading(true);
    try {
      await changePassword(currentPassword, newPassword);
      setSuccess('비밀번호가 성공적으로 변경되었습니다!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err instanceof Error ? err.message : '비밀번호 변경에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (resetNewPassword.length < 8) {
      setError('새 비밀번호는 8자 이상이어야 합니다.');
      return;
    }
    if (resetNewPassword !== resetConfirmPassword) {
      setError('새 비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(userId, email, resetNewPassword);
      setSuccess('비밀번호가 성공적으로 재설정되었습니다! 새 비밀번호로 로그인해 주세요.');
      setUserId('');
      setEmail('');
      setResetNewPassword('');
      setResetConfirmPassword('');
    } catch (err) {
      setError(err instanceof Error ? err.message : '비밀번호 재설정에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full bg-[#282828] border-2 border-[#383838] rounded-xl p-4 font-medium text-white placeholder-[#535353] focus:border-[#1DB954] focus:outline-none transition-all text-sm';

  return (
    <div className="max-w-md mx-auto mt-6 space-y-6 animate-fade-in">
      <div className="text-center">
        <div className="text-5xl mb-3">🔐</div>
        <h1 className="text-2xl font-black text-white">비밀번호 관리</h1>
        <p className="text-[#727272] text-sm mt-1">계정 보안을 위해 비밀번호를 안전하게 관리하세요.</p>
      </div>

      {/* 탭 전환 */}
      <div className="flex gap-2 bg-[#181818] p-1.5 rounded-2xl border border-[#282828]">
        <button
          type="button"
          onClick={() => { setMode('change'); setError(''); setSuccess(''); }}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
            mode === 'change' ? 'bg-[#1DB954] text-black' : 'text-[#727272] hover:text-white'
          }`}
        >
          비밀번호 변경
        </button>
        <button
          type="button"
          onClick={() => { setMode('reset'); setError(''); setSuccess(''); }}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
            mode === 'reset' ? 'bg-[#1DB954] text-black' : 'text-[#727272] hover:text-white'
          }`}
        >
          비밀번호 재설정(분실 시)
        </button>
      </div>

      {/* 1. 로그인 중 비밀번호 변경 폼 */}
      {mode === 'change' && (
        <div className="bg-[#181818] rounded-2xl p-6 border border-[#282828] space-y-5">
          {!session && ready ? (
            <div className="text-center py-6 space-y-4">
              <p className="text-[#b3b3b3] text-sm">
                현재 로그인되어 있지 않습니다.<br />
                비밀번호를 변경하시려면 먼저 로그인해 주세요.
              </p>
              <div className="flex justify-center gap-2">
                <Link
                  href="/login"
                  className="px-5 py-2.5 rounded-full bg-[#1DB954] text-black text-xs font-black hover:bg-[#1ed760] transition-all"
                >
                  로그인하기
                </Link>
                <button
                  onClick={() => setMode('reset')}
                  className="px-5 py-2.5 rounded-full border border-[#535353] text-[#b3b3b3] text-xs font-bold hover:text-white hover:border-white transition-all"
                >
                  비밀번호 잊으셨나요?
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleChangeSubmit} className="space-y-4">
              <div className="bg-[#282828] p-3 rounded-xl border border-[#383838] flex items-center justify-between text-xs">
                <span className="text-[#727272] font-bold">로그인 계정</span>
                <span className="text-[#1DB954] font-black">{session?.userId} ({session?.email})</span>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#b3b3b3] mb-2">현재 비밀번호</label>
                <input
                  type="password"
                  className={inputClass}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="현재 비밀번호 입력"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#b3b3b3] mb-2">새 비밀번호</label>
                <input
                  type="password"
                  className={inputClass}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="새 비밀번호 입력 (8자 이상)"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#b3b3b3] mb-2">새 비밀번호 확인</label>
                <input
                  type="password"
                  className={inputClass}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="새 비밀번호 다시 입력"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-900/30 border border-red-700/50 rounded-xl p-3 text-red-400 text-sm font-medium">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-[#1DB954]/15 border border-[#1DB954]/40 rounded-xl p-4 text-[#1DB954] text-sm font-bold space-y-2">
                  <p>✓ {success}</p>
                  <button
                    type="button"
                    onClick={() => router.push('/')}
                    className="w-full py-2.5 rounded-full bg-[#1DB954] text-black font-black text-xs hover:bg-[#1ed760] transition-all"
                  >
                    홈으로 가기
                  </button>
                </div>
              )}

              {!success && (
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-full bg-[#1DB954] text-black font-black text-base hover:bg-[#1ed760] disabled:opacity-50 transition-all shadow-lg"
                >
                  {loading ? '변경 중...' : '비밀번호 변경하기'}
                </button>
              )}
            </form>
          )}
        </div>
      )}

      {/* 2. 비밀번호 분실 시 재설정 폼 */}
      {mode === 'reset' && (
        <div className="bg-[#181818] rounded-2xl p-6 border border-[#282828] space-y-4">
          <p className="text-[#b3b3b3] text-xs leading-relaxed">
            가입하신 <b>아이디</b>와 <b>등록된 이메일</b>이 일치하면 새로운 비밀번호로 바로 재설정할 수 있습니다.
          </p>

          <form onSubmit={handleResetSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-[#b3b3b3] mb-2">아이디</label>
              <input
                type="text"
                className={inputClass}
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="가입한 아이디 입력"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#b3b3b3] mb-2">가입 시 이메일</label>
              <input
                type="email"
                className={inputClass}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="가입 시 입력했던 이메일"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#b3b3b3] mb-2">새 비밀번호</label>
              <input
                type="password"
                className={inputClass}
                value={resetNewPassword}
                onChange={(e) => setResetNewPassword(e.target.value)}
                placeholder="새 비밀번호 입력 (8자 이상)"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#b3b3b3] mb-2">새 비밀번호 확인</label>
              <input
                type="password"
                className={inputClass}
                value={resetConfirmPassword}
                onChange={(e) => setResetConfirmPassword(e.target.value)}
                placeholder="새 비밀번호 다시 입력"
                required
              />
            </div>

            {error && (
              <div className="bg-red-900/30 border border-red-700/50 rounded-xl p-3 text-red-400 text-sm font-medium">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-[#1DB954]/15 border border-[#1DB954]/40 rounded-xl p-4 text-[#1DB954] text-sm font-bold space-y-3">
                <p>✓ {success}</p>
                <Link
                  href="/login"
                  className="block w-full py-3 text-center rounded-full bg-[#1DB954] text-black font-black text-xs hover:bg-[#1ed760] transition-all"
                >
                  새 비밀번호로 로그인하기 →
                </Link>
              </div>
            )}

            {!success && (
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-full bg-[#1DB954] text-black font-black text-base hover:bg-[#1ed760] disabled:opacity-50 transition-all shadow-lg"
              >
                {loading ? '재설정 중...' : '비밀번호 재설정하기'}
              </button>
            )}
          </form>
        </div>
      )}

      <div className="flex justify-between items-center text-xs text-[#727272] px-2">
        <Link href="/" className="hover:text-white transition-colors">← 홈으로 돌아가기</Link>
        <Link href="/login" className="hover:text-[#1DB954] transition-colors">로그인 페이지</Link>
      </div>
    </div>
  );
}

export default function ChangePasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-md mx-auto mt-12 text-center text-[#727272] text-sm py-12">
          <div className="text-3xl animate-spin mb-3">🌱</div>
          페이지를 불러오는 중입니다...
        </div>
      }
    >
      <ChangePasswordForm />
    </Suspense>
  );
}
