import type { AssessmentResult } from '@/types';

export interface Profile {
  id: string;
  name: string;
  birthdate: string;
  gender: 'female' | 'male';
  parentEmail: string;
}

export interface GrowthRecord {
  id: string;
  date: string; // YYYY-MM-DD
  ageMonths: number;
  height: number;
  weight: number;
  heightPercentile?: number;
  weightPercentile?: number;
}

export interface CloudData {
  profile: Profile | null;
  kdst: AssessmentResult[];
  growth: GrowthRecord[];
}

const PROFILE_KEY = 'ieye_profile';
const HISTORY_PREFIX = 'ieye_history_';
const GROWTH_PREFIX = 'ieye_growth_';

export const DATA_CHANGED_EVENT = 'ieye-data-changed';

const isBrowser = () => typeof window !== 'undefined';

function notifyChanged() {
  if (isBrowser()) window.dispatchEvent(new Event(DATA_CHANGED_EVENT));
}

function readJSON<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function getProfile(): Profile | null {
  return readJSON<Profile | null>(PROFILE_KEY, null);
}

export function saveProfile(profile: Profile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  notifyChanged();
}

/* ---------- KDST 자가진단 기록 (발달) ---------- */
export function getKdstHistory(childId: string): AssessmentResult[] {
  return readJSON<AssessmentResult[]>(HISTORY_PREFIX + childId, []);
}

export function addKdstResult(childId: string, result: AssessmentResult) {
  const list = getKdstHistory(childId);
  list.push(result);
  localStorage.setItem(HISTORY_PREFIX + childId, JSON.stringify(list));
  notifyChanged();
}

/* ---------- 성장 기록 (키/몸무게) ---------- */
export function getGrowth(childId: string): GrowthRecord[] {
  const list = readJSON<GrowthRecord[]>(GROWTH_PREFIX + childId, []);
  return [...list].sort((a, b) => a.date.localeCompare(b.date));
}

export function saveGrowth(childId: string, list: GrowthRecord[]) {
  localStorage.setItem(GROWTH_PREFIX + childId, JSON.stringify(list));
  notifyChanged();
}

/* ---------- 계정 동기화용 ---------- */
export function collectAll(): CloudData | null {
  const profile = getProfile();
  if (!profile) return null;
  // 용량 절약: 문항별 응답은 동기화 대상에서 제외 (점수/결과만 저장)
  const kdst = getKdstHistory(profile.id).map((r) => ({ ...r, questionResponses: [] }));
  const growth = getGrowth(profile.id);
  return { profile, kdst, growth };
}

export function clearLocalUserData() {
  if (!isBrowser()) return;
  const toRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && (k === PROFILE_KEY || k.startsWith(HISTORY_PREFIX) || k.startsWith(GROWTH_PREFIX))) {
      toRemove.push(k);
    }
  }
  toRemove.forEach((k) => localStorage.removeItem(k));
  sessionStorage.removeItem('latest_result');
}

export function applyAll(data: CloudData | null) {
  clearLocalUserData();
  if (!data || !data.profile) return;
  localStorage.setItem(PROFILE_KEY, JSON.stringify(data.profile));
  localStorage.setItem(HISTORY_PREFIX + data.profile.id, JSON.stringify(data.kdst ?? []));
  localStorage.setItem(GROWTH_PREFIX + data.profile.id, JSON.stringify(data.growth ?? []));
}
