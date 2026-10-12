'use client';
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import * as auth from '@/lib/auth';
import type { Session } from '@/lib/auth';
import { DATA_CHANGED_EVENT, applyAll, clearLocalUserData, collectAll } from '@/lib/storage';

type SyncState = 'idle' | 'syncing' | 'ok' | 'error';

interface AuthContextValue {
  session: Session | null;
  ready: boolean;
  syncState: SyncState;
  signup: (userId: string, email: string, password: string) => Promise<void>;
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  resetPassword: (userId: string, email: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [syncState, setSyncState] = useState<SyncState>('idle');
  const sessionRef = useRef<Session | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const s = auth.loadSession();
    sessionRef.current = s;
    setSession(s);
    setReady(true);
  }, []);

  const push = useCallback(async (): Promise<boolean> => {
    const s = sessionRef.current;
    if (!s) return true;
    const data = collectAll();
    if (!data) return true;
    setSyncState('syncing');
    try {
      await auth.pushData(s, data);
      setSyncState('ok');
      return true;
    } catch {
      setSyncState('error');
      return false;
    }
  }, []);

  // 데이터가 바뀌면(프로필/진단/성장기록 저장) 1.5초 뒤 계정에 자동 저장
  useEffect(() => {
    const onChange = () => {
      if (!sessionRef.current) return;
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(push, 1500);
    };
    window.addEventListener(DATA_CHANGED_EVENT, onChange);
    return () => window.removeEventListener(DATA_CHANGED_EVENT, onChange);
  }, [push]);

  const activate = (s: Session) => {
    auth.saveSession(s);
    sessionRef.current = s;
    setSession(s);
  };

  const signup = useCallback(async (userId: string, email: string, password: string) => {
    const s = await auth.signup(userId, email, password);
    activate(s);
    await push(); // 가입 전에 이 기기에서 입력해 둔 기록(비회원)이 있으면 새 계정으로 옮김
  }, [push]);

  const login = useCallback(async (identifier: string, password: string) => {
    const { session: s, data } = await auth.login(identifier, password);
    activate(s);
    if (data && data.profile) {
      applyAll(data); // 계정에 저장된 기록으로 교체
    } else {
      await push(); // 계정이 비어 있으면 이 기기의 기록을 계정으로 올림
    }
  }, [push]);

  const logout = useCallback(async () => {
    if (timer.current) clearTimeout(timer.current);
    const saved = await push(); // 로그아웃 직전 마지막 저장
    if (!saved && !window.confirm('서버에 마지막 기록을 저장하지 못했습니다.\n그래도 로그아웃하면 저장되지 않은 기록은 사라집니다. 계속할까요?')) {
      return;
    }
    auth.clearSession();
    sessionRef.current = null;
    setSession(null);
    setSyncState('idle');
    clearLocalUserData(); // 다음 사람이 이 기기에서 내 기록을 보지 못하도록 삭제
  }, [push]);

  const changePassword = useCallback(async (oldPassword: string, newPassword: string) => {
    if (!sessionRef.current) throw new Error('로그인이 필요합니다.');
    const nextSession = await auth.changePassword(sessionRef.current, oldPassword, newPassword);
    sessionRef.current = nextSession;
    setSession(nextSession);
  }, []);

  const resetPassword = useCallback(async (userId: string, email: string, newPassword: string) => {
    await auth.resetPassword(userId, email, newPassword);
  }, []);

  return (
    <AuthContext.Provider value={{ session, ready, syncState, signup, login, logout, changePassword, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}
