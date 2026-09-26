'use client';
import { useState } from 'react';

interface SetupModalProps {
  onComplete: (profile: { name: string; birthdate: string; gender: 'female' | 'male'; parentEmail: string }) => void;
}

export function SetupModal({ onComplete }: SetupModalProps) {
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('2023-11-02');
  const [gender, setGender] = useState<'female' | 'male'>('female');
  const [parentEmail, setParentEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onComplete({ name, birthdate, gender, parentEmail });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3.5 rounded-xl bg-[#3E3E3E] border border-[#535353] text-white placeholder-[#727272] focus:border-[#1DB954] focus:ring-1 focus:ring-[#1DB954] outline-none text-sm font-medium transition-all";

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[#181818] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-[#282828]">
        {/* Header */}
        <div className="bg-gradient-to-b from-[#1DB954]/20 to-transparent p-8 pb-4 border-b border-[#282828]">
          <div className="w-16 h-16 rounded-full bg-[#1DB954] flex items-center justify-center text-3xl mb-4 shadow-lg" style={{boxShadow: '0 0 30px rgba(29,185,84,0.4)'}}>
            🌱
          </div>
          <h2 className="text-2xl font-black text-white">아이아이에 오신 것을 환영합니다!</h2>
          <p className="text-[#b3b3b3] text-sm mt-1">아이 정보를 입력하고 맞춤 발달 가이드를 받아보세요.</p>
        </div>

        <div className="p-6 space-y-4">
          {/* Child Name */}
          <div>
            <label className="block text-sm font-bold text-[#b3b3b3] mb-2">아이 이름 <span className="text-[#1DB954]">*</span></label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 서연, 지호"
              className={inputClass}
            />
          </div>

          {/* Birthdate */}
          <div>
            <label className="block text-sm font-bold text-[#b3b3b3] mb-2">생년월일 <span className="text-[#1DB954]">*</span></label>
            <input
              type="date"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-bold text-[#b3b3b3] mb-2">성별 <span className="text-[#1DB954]">*</span></label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setGender('female')}
                className={`p-4 rounded-xl border-2 text-center transition-all font-bold ${
                  gender === 'female'
                    ? 'border-[#1DB954] bg-[#1DB954]/10 text-[#1DB954]'
                    : 'border-[#535353] text-[#727272] hover:border-[#b3b3b3] hover:text-white bg-[#282828]'
                }`}
              >
                👧 여아
              </button>
              <button
                onClick={() => setGender('male')}
                className={`p-4 rounded-xl border-2 text-center transition-all font-bold ${
                  gender === 'male'
                    ? 'border-[#1DB954] bg-[#1DB954]/10 text-[#1DB954]'
                    : 'border-[#535353] text-[#727272] hover:border-[#b3b3b3] hover:text-white bg-[#282828]'
                }`}
              >
                👦 남아
              </button>
            </div>
          </div>

          {/* Parent Email */}
          <div>
            <label className="block text-sm font-bold text-[#b3b3b3] mb-2">부모님 이메일 <span className="text-[#535353] font-normal text-xs">(선택)</span></label>
            <input
              type="email"
              value={parentEmail}
              onChange={(e) => setParentEmail(e.target.value)}
              placeholder="example@gmail.com"
              className={inputClass}
            />
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!name || !birthdate || loading}
            className="w-full py-4 rounded-full bg-[#1DB954] text-black font-black text-base hover:bg-[#1ed760] hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100 transition-all active:scale-[0.98]"
            style={!loading && name && birthdate ? {boxShadow: '0 0 20px rgba(29,185,84,0.3)'} : {}}
          >
            {loading ? '저장 중...' : '시작하기 →'}
          </button>

          <p className="text-center text-xs text-[#535353]">
            데이터는 개인 Google 스프레드시트에만 저장됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}
