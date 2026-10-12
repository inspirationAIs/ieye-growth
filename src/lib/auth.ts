import { GAS_URL, isCloudEnabled } from '@/lib/config';
import type { CloudData } from '@/lib/storage';

export interface Session {
  userId: string;
  email: string;
  token: string;
}

const SESSION_KEY = 'ieye_session';
const LOCAL_USERS_KEY = 'ieye_local_users';
const LOCAL_BLOB_PREFIX = 'ieye_localblob_';

/* ---------------- 유효성 검사 ---------------- */
export const ID_RULE = /^[a-z0-9_]{4,20}$/;
export const EMAIL_RULE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateSignup(userId: string, email: string, password: string, confirm: string): string | null {
  if (!ID_RULE.test(userId)) return '아이디는 영문 소문자·숫자·밑줄(_) 4~20자로 입력해 주세요.';
  if (!EMAIL_RULE.test(email)) return '이메일 형식이 올바르지 않습니다.';
  if (password.length < 8) return '비밀번호는 8자 이상이어야 합니다.';
  if (password !== confirm) return '비밀번호 확인이 일치하지 않습니다.';
  return null;
}

/* ---------------- 비밀번호 해시 (브라우저에서 먼저 암호화해서 전송) ---------------- */
async function hashPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode('ieye-v1:' + password);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

function randomToken(): string {
  const a = new Uint8Array(16);
  crypto.getRandomValues(a);
  return Array.from(a).map((b) => b.toString(16).padStart(2, '0')).join('');
}

/* ---------------- 세션 ---------------- */
export function loadSession(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}
export function saveSession(s: Session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(s));
}
export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

/* ---------------- 서버(구글 시트) 호출 ---------------- */
async function gas<T>(body: object): Promise<T> {
  // Content-Type을 지정하지 않아(text/plain) 브라우저 사전요청(CORS preflight) 없이 호출됩니다.
  const res = await fetch(GAS_URL, { method: 'POST', body: JSON.stringify(body) });
  return (await res.json()) as T;
}

interface ServerReply {
  ok: boolean;
  error?: string;
  token?: string;
  userId?: string;
  email?: string;
  data?: string | null;
}

const ERROR_MESSAGES: Record<string, string> = {
  ID_EXISTS: '이미 사용 중인 아이디입니다.',
  EMAIL_EXISTS: '이미 가입된 이메일입니다.',
  INVALID_LOGIN: '아이디(이메일) 또는 비밀번호가 올바르지 않습니다.',
  INVALID_SESSION: '로그인이 만료되었습니다. 다시 로그인해 주세요.',
  INVALID_PASSWORD: '현재 비밀번호가 일치하지 않습니다.',
  USER_NOT_FOUND: '등록되지 않은 사용자입니다.',
  EMAIL_MISMATCH: '아이디와 가입 시 등록한 이메일이 일치하지 않습니다.',
  BAD_PASSWORD: '비밀번호는 8자 이상이어야 합니다.',
  UNKNOWN_ACTION: '서버 스크립트 업데이트가 필요합니다. 구글 시트 배포 관리에서 새 버전으로 배포해 주세요.',
};
const friendly = (code?: string) => ERROR_MESSAGES[code ?? ''] ?? `서버 오류가 발생했습니다. (${code ?? 'unknown'})`;

/* ---------------- 이 기기 전용 모드 (서버 주소 미설정 시) ---------------- */
interface LocalUser { userId: string; email: string; hash: string }
const readLocalUsers = (): LocalUser[] => {
  try { return JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) || '[]'); } catch { return []; }
};

/* ---------------- 공개 API ---------------- */
export async function signup(userId: string, email: string, password: string): Promise<Session> {
  const id = userId.trim().toLowerCase();
  const mail = email.trim().toLowerCase();
  const hash = await hashPassword(password);

  if (isCloudEnabled()) {
    const r = await gas<ServerReply>({ action: 'signup', userId: id, email: mail, passHash: hash });
    if (!r.ok) throw new Error(friendly(r.error));
    return { userId: id, email: mail, token: r.token! };
  }

  const users = readLocalUsers();
  if (users.some((u) => u.userId === id)) throw new Error(friendly('ID_EXISTS'));
  if (users.some((u) => u.email === mail)) throw new Error(friendly('EMAIL_EXISTS'));
  users.push({ userId: id, email: mail, hash });
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
  return { userId: id, email: mail, token: randomToken() };
}

export async function login(identifier: string, password: string): Promise<{ session: Session; data: CloudData | null }> {
  const ident = identifier.trim().toLowerCase();
  const hash = await hashPassword(password);

  if (isCloudEnabled()) {
    const r = await gas<ServerReply>({ action: 'login', identifier: ident, passHash: hash });
    if (!r.ok) throw new Error(friendly(r.error));
    let data: CloudData | null = null;
    if (r.data) { try { data = JSON.parse(r.data); } catch { data = null; } }
    return { session: { userId: r.userId!, email: r.email!, token: r.token! }, data };
  }

  const user = readLocalUsers().find((u) => (u.userId === ident || u.email === ident) && u.hash === hash);
  if (!user) throw new Error(friendly('INVALID_LOGIN'));
  let data: CloudData | null = null;
  try { data = JSON.parse(localStorage.getItem(LOCAL_BLOB_PREFIX + user.userId) || 'null'); } catch { data = null; }
  return { session: { userId: user.userId, email: user.email, token: randomToken() }, data };
}

export async function pushData(session: Session, data: CloudData): Promise<void> {
  if (isCloudEnabled()) {
    const r = await gas<ServerReply>({
      action: 'save', userId: session.userId, token: session.token, data: JSON.stringify(data),
    });
    if (!r.ok) throw new Error(friendly(r.error));
    return;
  }
  localStorage.setItem(LOCAL_BLOB_PREFIX + session.userId, JSON.stringify(data));
}

export async function changePassword(session: Session, oldPass: string, newPass: string): Promise<Session> {
  if (newPass.length < 8) throw new Error(friendly('BAD_PASSWORD'));
  const oldHash = await hashPassword(oldPass);
  const newHash = await hashPassword(newPass);

  if (isCloudEnabled()) {
    const r = await gas<ServerReply>({
      action: 'changePassword',
      userId: session.userId,
      token: session.token,
      oldPassHash: oldHash,
      newPassHash: newHash,
    });
    if (!r.ok) throw new Error(friendly(r.error));
    const nextSession: Session = { ...session, token: r.token ?? session.token };
    saveSession(nextSession);
    return nextSession;
  }

  const users = readLocalUsers();
  const idx = users.findIndex((u) => u.userId === session.userId && u.hash === oldHash);
  if (idx < 0) throw new Error(friendly('INVALID_PASSWORD'));
  users[idx].hash = newHash;
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
  const nextSession: Session = { ...session, token: randomToken() };
  saveSession(nextSession);
  return nextSession;
}

export async function resetPassword(userId: string, email: string, newPass: string): Promise<void> {
  const id = userId.trim().toLowerCase();
  const mail = email.trim().toLowerCase();
  if (newPass.length < 8) throw new Error(friendly('BAD_PASSWORD'));
  const newHash = await hashPassword(newPass);

  if (isCloudEnabled()) {
    const r = await gas<ServerReply>({
      action: 'resetPassword',
      userId: id,
      email: mail,
      newPassHash: newHash,
    });
    if (!r.ok) throw new Error(friendly(r.error));
    return;
  }

  const users = readLocalUsers();
  const idx = users.findIndex((u) => u.userId === id && u.email === mail);
  if (idx < 0) throw new Error(friendly('EMAIL_MISMATCH'));
  users[idx].hash = newHash;
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
}
