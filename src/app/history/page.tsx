'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { calculateGrowthPercentiles } from '@/data/growth';
import { calculateAgeMonths, formatDate } from '@/lib/age-calculator';
import { getGrowth, getProfile, saveGrowth } from '@/lib/storage';
import type { GrowthRecord, Profile } from '@/lib/storage';

// 부모 키 기반 성인 예상 키 (간이식)
function predictAdultHeight(currentHeight: number, ageMonths: number, gender: 'male' | 'female', father: number, mother: number): number {
  const midParent = gender === 'male' ? (father + mother + 13) / 2 : (father + mother - 13) / 2;
  const ageRatio = Math.min(1, ageMonths / 180);
  const predicted = midParent * (1 - ageRatio * 0.3) + currentHeight * (ageRatio * 0.3 + 0.1);
  return Math.round(predicted * 10) / 10;
}

const today = () => {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
};

function TrendChart({ data, dataKey, unit, color }: { data: GrowthRecord[]; dataKey: 'height' | 'weight'; unit: string; color: string }) {
  const rows = data.map((r) => ({ label: r.date.slice(2).replace(/-/g, '.'), value: r[dataKey] }));
  const values = rows.map((r) => r.value);
  const min = Math.floor(Math.min(...values) - 2);
  const max = Math.ceil(Math.max(...values) + 2);
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={rows} margin={{ top: 8, right: 16, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#282828" />
        <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#727272' }} />
        <YAxis domain={[min, max]} tick={{ fontSize: 10, fill: '#727272' }} />
        <Tooltip
          formatter={(v: number) => [`${v}${unit}`, dataKey === 'height' ? '키' : '몸무게']}
          contentStyle={{ background: '#282828', border: '1px solid #383838', borderRadius: 12, fontSize: 12, color: '#fff' }}
        />
        <Line type="monotone" dataKey="value" stroke={color} strokeWidth={3} dot={{ r: 4, fill: color }} activeDot={{ r: 6 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default function GrowthPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [records, setRecords] = useState<GrowthRecord[]>([]);
  const [date, setDate] = useState(today());
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [error, setError] = useState('');
  const [father, setFather] = useState('');
  const [mother, setMother] = useState('');
  const [adult, setAdult] = useState<number | null>(null);

  useEffect(() => {
    const p = getProfile();
    if (!p) { router.push('/'); return; }
    setProfile(p);
    setRecords(getGrowth(p.id));
  }, [router]);

  if (!profile) {
    return <div className="flex items-center justify-center min-h-[40vh] text-[#b3b3b3]">로딩 중...</div>;
  }

  const addRecord = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const h = Number(height);
    const w = Number(weight);
    if (!date) return setError('측정 날짜를 선택해 주세요.');
    if (date < profile.birthdate) return setError('측정 날짜가 생년월일보다 빠릅니다.');
    if (date > today()) return setError('미래 날짜는 입력할 수 없습니다.');
    if (!(h >= 30 && h <= 160)) return setError('키는 30~160cm 사이로 입력해 주세요.');
    if (!(w >= 2 && w <= 80)) return setError('몸무게는 2~80kg 사이로 입력해 주세요.');

    const ageMonths = calculateAgeMonths(profile.birthdate, new Date(date));
    const pct = calculateGrowthPercentiles(ageMonths, profile.gender, h, w);
    const rec: GrowthRecord = {
      id: `g_${Date.now()}`, date, ageMonths, height: h, weight: w,
      heightPercentile: pct.heightPercentile, weightPercentile: pct.weightPercentile,
    };
    const next = [...records.filter((r) => r.date !== date), rec].sort((a, b) => a.date.localeCompare(b.date));
    saveGrowth(profile.id, next);
    setRecords(next);
    setHeight('');
    setWeight('');
  };

  const removeRecord = (id: string) => {
    if (!confirm('이 측정 기록을 삭제할까요?')) return;
    const next = records.filter((r) => r.id !== id);
    saveGrowth(profile.id, next);
    setRecords(next);
  };

  const latest = records[records.length - 1];
  const input = 'w-full bg-[#282828] border-2 border-[#383838] rounded-xl p-3.5 font-medium text-white placeholder-[#535353] focus:border-[#1DB954] focus:outline-none transition-all';

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black text-white">📏 성장 기록</h1>
        <p className="text-[#727272] text-sm mt-1">
          <b className="text-[#1DB954]">신체</b> 성장 기록입니다. 키·몸무게를 측정할 때마다 입력하면 또래 대비 백분위와 성장 그래프가 쌓입니다.
          발달 검사는 <Link href="/check" className="text-[#1DB954] font-bold hover:underline">✏️ KDST 자가진단</Link>에서 해요.
        </p>
      </div>

      {/* 측정 입력 */}
      <form onSubmit={addRecord} className="bg-[#181818] rounded-2xl p-5 border border-[#282828] space-y-4">
        <h3 className="font-black text-white">➕ 새 측정 기록</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-[#b3b3b3] mb-1.5">측정일</label>
            <input type="date" className={input} value={date} max={today()} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#b3b3b3] mb-1.5">키 (cm)</label>
            <input type="number" step="0.1" className={input} value={height} onChange={(e) => setHeight(e.target.value)} placeholder="예: 95.1" />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#b3b3b3] mb-1.5">몸무게 (kg)</label>
            <input type="number" step="0.1" className={input} value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="예: 13.9" />
          </div>
        </div>
        {error && <div className="bg-red-900/30 border border-red-700/50 rounded-xl p-3 text-red-400 text-sm font-medium">{error}</div>}
        <button type="submit" disabled={!height || !weight}
          className="w-full py-3.5 rounded-full bg-[#1DB954] text-black font-black hover:bg-[#1ed760] disabled:opacity-40 transition-all">
          기록 저장
        </button>
        <p className="text-[11px] text-[#535353]">같은 날짜에 다시 저장하면 해당 날짜 기록이 수정됩니다. 기준: 질병관리청 소아청소년 성장도표(근사치)</p>
      </form>

      {records.length === 0 ? (
        <div className="bg-[#181818] rounded-2xl p-10 border border-[#282828] text-center space-y-2">
          <div className="text-5xl">📏</div>
          <p className="font-black text-white">아직 성장 기록이 없습니다</p>
          <p className="text-[#727272] text-sm">위에서 첫 키·몸무게를 입력해 보세요.</p>
        </div>
      ) : (
        <>
          {/* 최신 상태 */}
          {latest && latest.heightPercentile !== undefined && latest.weightPercentile !== undefined && (
            <div className="bg-[#181818] rounded-2xl p-5 border border-[#1DB954]/30 space-y-3" style={{ boxShadow: '0 0 20px rgba(29,185,84,0.08)' }}>
              <div className="flex items-center justify-between">
                <h3 className="font-black text-white">📊 최근 발육 상태</h3>
                <span className="text-xs text-[#727272]">{formatDate(latest.date)} · 생후 {latest.ageMonths}개월</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#282828] rounded-xl p-4 text-center border border-[#383838]">
                  <p className="text-[#727272] text-xs font-bold mb-1">키 ({latest.height}cm)</p>
                  <p className="text-[#1DB954] font-black text-3xl">상위 {100 - latest.heightPercentile}%</p>
                  <p className="text-[#535353] text-xs mt-1">또래 100명 중 {100 - latest.heightPercentile}번째로 큼</p>
                </div>
                <div className="bg-[#282828] rounded-xl p-4 text-center border border-[#383838]">
                  <p className="text-[#727272] text-xs font-bold mb-1">몸무게 ({latest.weight}kg)</p>
                  <p className="text-[#3b82f6] font-black text-3xl">상위 {100 - latest.weightPercentile}%</p>
                  <p className="text-[#535353] text-xs mt-1">또래 100명 중 {100 - latest.weightPercentile}번째로 무거움</p>
                </div>
              </div>
            </div>
          )}

          {/* 그래프 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#181818] rounded-2xl p-4 border border-[#282828]">
              <h4 className="font-black text-white text-sm mb-2">키 변화 (cm)</h4>
              <TrendChart data={records} dataKey="height" unit="cm" color="#1DB954" />
            </div>
            <div className="bg-[#181818] rounded-2xl p-4 border border-[#282828]">
              <h4 className="font-black text-white text-sm mb-2">몸무게 변화 (kg)</h4>
              <TrendChart data={records} dataKey="weight" unit="kg" color="#3b82f6" />
            </div>
          </div>

          {/* 성인 예상 키 */}
          <div className="bg-[#181818] rounded-2xl p-5 border border-[#282828] space-y-3">
            <h3 className="font-black text-white">🔮 성인 예상 키</h3>
            <p className="text-xs text-[#727272]">최근 키({latest.height}cm)와 부모님 키로 대략적인 성인 키를 예측합니다. 참고용입니다.</p>
            <div className="grid grid-cols-2 gap-3">
              <input type="number" className={input} value={father} onChange={(e) => setFather(e.target.value)} placeholder="아빠 키 (cm)" />
              <input type="number" className={input} value={mother} onChange={(e) => setMother(e.target.value)} placeholder="엄마 키 (cm)" />
            </div>
            <button onClick={() => setAdult(predictAdultHeight(latest.height, latest.ageMonths, profile.gender, Number(father), Number(mother)))}
              disabled={!father || !mother}
              className="w-full py-3 rounded-full bg-[#1DB954]/20 text-[#1DB954] font-bold border border-[#1DB954]/30 hover:bg-[#1DB954]/30 disabled:opacity-40 transition-all">
              예측하기
            </button>
            {adult && (
              <div className="bg-[#282828] rounded-xl p-4 text-center border border-[#383838]">
                <p className="text-[#727272] text-xs font-bold">{profile.name}의 예상 성인 키</p>
                <p className="text-[#1DB954] font-black text-3xl">{adult} cm</p>
              </div>
            )}
          </div>

          {/* 기록 목록 */}
          <div className="space-y-2.5">
            <h3 className="font-black text-white">측정 기록 ({records.length}회)</h3>
            {[...records].reverse().map((r) => (
              <div key={r.id} className="bg-[#181818] rounded-2xl p-4 border border-[#282828] flex items-center justify-between gap-3">
                <div>
                  <div className="font-black text-white text-sm">{formatDate(r.date)} <span className="text-[#727272] font-medium text-xs">· 생후 {r.ageMonths}개월</span></div>
                  <div className="text-xs text-[#b3b3b3] mt-1">
                    키 <b className="text-white">{r.height}cm</b>
                    {r.heightPercentile !== undefined && <span className="text-[#1DB954]"> (상위 {100 - r.heightPercentile}%)</span>}
                    {' · '}몸무게 <b className="text-white">{r.weight}kg</b>
                    {r.weightPercentile !== undefined && <span className="text-[#3b82f6]"> (상위 {100 - r.weightPercentile}%)</span>}
                  </div>
                </div>
                <button onClick={() => removeRecord(r.id)} className="text-xs text-[#535353] hover:text-red-400 font-bold shrink-0">삭제</button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
