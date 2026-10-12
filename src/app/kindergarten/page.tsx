'use client';
import { useState, useMemo } from 'react';
import { searchFacilities, getAllCities, getDistricts, getDongs, KINDERGARTEN_DB } from '@/data/kindergartenDB';
import type { DongData, Facility } from '@/data/kindergartenDB';

const TYPE_CONFIG: Record<Facility['type'], { color: string; bg: string; border: string }> = {
  '국공립유치원':   { color: '#1DB954', bg: 'bg-[#1DB954]/10',  border: 'border-[#1DB954]/30' },
  '사립유치원':     { color: '#3b82f6', bg: 'bg-[#3b82f6]/10',  border: 'border-[#3b82f6]/30' },
  '국공립어린이집': { color: '#f59e0b', bg: 'bg-[#f59e0b]/10',  border: 'border-[#f59e0b]/30' },
  '민간어린이집':   { color: '#a855f7', bg: 'bg-[#a855f7]/10',  border: 'border-[#a855f7]/30' },
  '가정어린이집':   { color: '#f97316', bg: 'bg-[#f97316]/10',  border: 'border-[#f97316]/30' },
  '직장어린이집':   { color: '#06b6d4', bg: 'bg-[#06b6d4]/10',  border: 'border-[#06b6d4]/30' },
};

function FacilityCard({ f }: { f: Facility }) {
  const cfg = TYPE_CONFIG[f.type] || TYPE_CONFIG['민간어린이집'];
  const isKindergarten = f.type.includes('유치원');
  const portalUrl = isKindergarten
    ? 'https://e-childschoolinfo.moe.go.kr'
    : 'https://info.childcare.go.kr';
  const portalName = isKindergarten ? '유치원알리미' : '아이사랑 포털';

  return (
    <div className={`bg-[#282828] rounded-2xl p-4 border ${cfg.border} space-y-3`}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <h4 className="font-black text-white text-sm flex items-center gap-2">
            {f.name}
            {f.phone && <span className="text-[11px] font-normal text-[#b3b3b3]">📞 {f.phone}</span>}
          </h4>
          <p className="text-[#727272] text-xs mt-0.5">{f.address}</p>
        </div>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border shrink-0 ${cfg.bg} ${cfg.border}`}
          style={{ color: cfg.color }}>
          {f.type}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-[#1a1a1a] rounded-xl p-2">
          <p className="text-[#535353] font-bold mb-0.5">연령</p>
          <p className="text-[#b3b3b3] font-semibold">{f.ageRange}</p>
        </div>
        <div className="bg-[#1a1a1a] rounded-xl p-2">
          <p className="text-[#535353] font-bold mb-0.5">정원</p>
          <p className="text-[#b3b3b3] font-semibold">{f.capacity}명</p>
        </div>
        <div className="bg-[#1a1a1a] rounded-xl p-2">
          <p className="text-[#535353] font-bold mb-0.5">운영시간</p>
          <p className="text-[#b3b3b3] font-semibold">{f.operatingHours}</p>
        </div>
        <div className="bg-[#1a1a1a] rounded-xl p-2">
          <p className="text-[#535353] font-bold mb-0.5">보육료</p>
          <p className="font-semibold" style={{ color: cfg.color }}>{f.fee}</p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 pt-1">
        {f.features.length > 0 ? (
          <div className="flex flex-wrap gap-1.5 flex-1">
            {f.features.map((feat, i) => (
              <span key={i} className="text-[10px] font-bold bg-[#1a1a1a] text-[#727272] px-2 py-1 rounded-full border border-[#383838]">
                {feat}
              </span>
            ))}
          </div>
        ) : <div />}

        <a
          href={portalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] font-bold text-[#b3b3b3] hover:text-[#1DB954] hover:underline shrink-0 bg-[#1a1a1a] px-2.5 py-1 rounded-full border border-[#383838] transition-colors"
        >
          {portalName} 공시정보 ↗
        </a>
      </div>
    </div>
  );
}

function DongCard({ data }: { data: DongData }) {
  const [expanded, setExpanded] = useState(false);
  const [typeFilter, setTypeFilter] = useState<Facility['type'] | 'all'>('all');

  const types = [...new Set(data.facilities.map(f => f.type))] as Facility['type'][];
  const filtered = typeFilter === 'all' ? data.facilities : data.facilities.filter(f => f.type === typeFilter);

  return (
    <div className="bg-[#181818] rounded-2xl border border-[#282828] overflow-hidden">
      <button className="w-full p-5 text-left" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-black text-white text-lg">{data.dong}</h3>
              <span className="text-xs text-[#727272] bg-[#282828] px-2 py-0.5 rounded-full border border-[#383838]">
                {data.district} · {data.city.replace('특별시','').replace('광역시','').replace('특별자치시','')}
              </span>
            </div>
            <p className="text-[#727272] text-xs leading-relaxed">{data.areaNote}</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-[#1DB954] text-xs font-bold bg-[#1DB954]/10 px-2.5 py-1 rounded-full border border-[#1DB954]/20">
              {data.facilities.length}개 시설
            </span>
            <span className="text-[#727272] text-lg">{expanded ? '▲' : '▼'}</span>
          </div>
        </div>
      </button>

      {expanded && (
        <div className="px-5 pb-5 space-y-4 border-t border-[#282828] pt-4">
          {/* Type filter */}
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setTypeFilter('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${typeFilter === 'all' ? 'bg-white text-black' : 'bg-[#282828] text-[#727272] hover:text-white border border-[#383838]'}`}>
              전체
            </button>
            {types.map(t => {
              const cfg = TYPE_CONFIG[t];
              return (
                <button key={t} onClick={() => setTypeFilter(t)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                    typeFilter === t ? `${cfg.bg} ${cfg.border}` : 'bg-[#282828] text-[#727272] border-[#383838] hover:text-white'
                  }`}
                  style={typeFilter === t ? { color: cfg.color } : {}}>
                  {t}
                </button>
              );
            })}
          </div>

          {/* Facility cards */}
          <div className="space-y-3">
            {filtered.map((f, i) => <FacilityCard key={i} f={f} />)}
          </div>
        </div>
      )}
    </div>
  );
}

export default function KindergartenPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [activeTab, setActiveTab] = useState<'search' | 'browse' | 'timeline'>('search');

  const cities = useMemo(() => getAllCities(), []);
  const districts = useMemo(() => selectedCity ? getDistricts(selectedCity) : [], [selectedCity]);
  const dongs = useMemo(() => selectedCity && selectedDistrict ? getDongs(selectedCity, selectedDistrict) : [], [selectedCity, selectedDistrict]);

  const searchResults = useMemo(() => {
    if (searchQuery.length < 1) return [];
    return searchFacilities(searchQuery);
  }, [searchQuery]);

  const totalFacilities = KINDERGARTEN_DB.reduce((sum, d) => sum + d.facilities.length, 0);

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-white">🏫 유치원 & 어린이집 정보</h1>
        <p className="text-[#727272] text-sm mt-1">
          동(洞) 단위로 검색하면 주변 유치원·어린이집을 바로 확인할 수 있습니다.
          <span className="text-[#1DB954] font-bold ml-2">총 {totalFacilities}개 시설 수록</span>
        </p>
      </div>

      {/* Tab selector */}
      <div className="flex gap-2 bg-[#181818] p-1.5 rounded-2xl border border-[#282828]">
        {[
          { id: 'search', label: '🔍 동(洞) 검색' },
          { id: 'browse', label: '🗺️ 지역별 찾기' },
          { id: 'timeline', label: '📅 입학 일정' },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === tab.id ? 'bg-[#1DB954] text-black' : 'text-[#727272] hover:text-white'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* 🔍 검색 탭 */}
      {activeTab === 'search' && (
        <div className="space-y-4">
          {/* 정부 공식 포털 연계 안내 배너 */}
          <div className="bg-[#181818] rounded-2xl p-4 border border-[#1DB954]/30 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-white flex items-center gap-1.5">
                <span className="text-base">🏛️</span> 교육부·보건복지부 공식 공시정보 연계
              </span>
              <span className="text-[10px] text-[#1DB954] font-bold bg-[#1DB954]/10 px-2 py-0.5 rounded-full border border-[#1DB954]/20">
                실시간 100% 공시
              </span>
            </div>
            <p className="text-[#b3b3b3] text-xs leading-relaxed">
              아이아이는 <b>개포동 이화유치원</b> 등 서울·수도권 주요 시설 정보와 함께 정부 공식 포털을 연결해 드립니다. 서울 모든 유치원과 어린이집의 상세 공시(교사대아동비율, 급식, 통학버스, CCTV)를 1초 만에 확인해 보세요!
            </p>
            <div className="flex gap-2 pt-1">
              <a
                href="https://e-childschoolinfo.moe.go.kr"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 rounded-xl bg-[#282828] border border-[#383838] hover:border-[#1DB954] text-white text-xs font-bold text-center transition-all"
              >
                🏫 유치원알리미 포털 ↗
              </a>
              <a
                href="https://info.childcare.go.kr"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 rounded-xl bg-[#282828] border border-[#383838] hover:border-[#f59e0b] text-white text-xs font-bold text-center transition-all"
              >
                👶 어린이집정보공개포털 ↗
              </a>
            </div>
          </div>

          {/* Search input */}
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="이화유치원, 개포동, 잠실, 목동, 숲체험, 국공립 등 입력..."
              className="w-full bg-[#282828] border-2 border-[#383838] rounded-2xl pl-12 pr-4 py-4 text-white font-medium placeholder-[#535353] focus:border-[#1DB954] focus:outline-none transition-all text-sm"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#535353] hover:text-white text-lg transition-colors">
                ✕
              </button>
            )}
          </div>

          {/* Search results */}
          {searchQuery.length >= 1 && searchResults.length === 0 && (
            <div className="bg-[#181818] rounded-2xl p-8 border border-[#282828] text-center space-y-4">
              <div className="text-4xl">🤔</div>
              <p className="text-[#b3b3b3] font-medium">"{searchQuery}"에 해당하는 내부 보관 데이터가 없습니다.</p>
              <p className="text-[#535353] text-xs">
                정부 공식 포털에서 대한민국 전체 유치원 및 어린이집을 바로 검색하실 수 있습니다.
              </p>
              <div className="flex justify-center gap-2 pt-2">
                <a
                  href={`https://e-childschoolinfo.moe.go.kr`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-full bg-[#1DB954] text-black text-xs font-black hover:bg-[#1ed760] transition-all"
                >
                  유치원알리미에서 검색 ↗
                </a>
                <a
                  href={`https://info.childcare.go.kr`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-full border border-[#535353] text-[#b3b3b3] text-xs font-bold hover:text-white hover:border-white transition-all"
                >
                  어린이집정보포털에서 검색 ↗
                </a>
              </div>
            </div>
          )}

          {searchResults.length > 0 && (
            <div className="space-y-3">
              <p className="text-[#727272] text-sm font-bold">"{searchQuery}" 검색 결과 — {searchResults.length}개 지역/시설</p>
              {searchResults.map((data, i) => <DongCard key={i} data={data} />)}
            </div>
          )}

          {/* 검색 전 안내 */}
          {!searchQuery && (
            <div className="space-y-3">
              <p className="text-xs font-bold text-[#727272] uppercase tracking-wider">💡 빠른 검색 추천</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {['이화유치원', '개포동', '대치동', '도곡동', '반포동', '잠실동', '목동', '여의도동', '아현동', '성수동', '중계동', '고덕동'].map(dong => (
                  <button key={dong} onClick={() => setSearchQuery(dong)}
                    className="py-2.5 px-3 rounded-xl text-xs font-bold bg-[#181818] border border-[#282828] text-[#b3b3b3] hover:border-[#1DB954]/40 hover:text-[#1DB954] transition-all text-center">
                    {dong}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 🗺️ 지역별 탭 */}
      {activeTab === 'browse' && (
        <div className="space-y-4">
          {/* City selector */}
          <div>
            <p className="text-xs font-bold text-[#727272] uppercase tracking-wider mb-2">시/도 선택</p>
            <div className="flex flex-wrap gap-2">
              {cities.map(city => (
                <button key={city} onClick={() => { setSelectedCity(city); setSelectedDistrict(''); }}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                    selectedCity === city ? 'bg-[#1DB954] text-black' : 'bg-[#282828] text-[#b3b3b3] border border-[#383838] hover:text-white'
                  }`}>
                  {city.replace('특별시','').replace('광역시','').replace('특별자치시','')}
                </button>
              ))}
            </div>
          </div>

          {/* District selector */}
          {selectedCity && (
            <div>
              <p className="text-xs font-bold text-[#727272] uppercase tracking-wider mb-2">구/군 선택</p>
              <div className="flex flex-wrap gap-2">
                {districts.map(dist => (
                  <button key={dist} onClick={() => setSelectedDistrict(dist)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                      selectedDistrict === dist ? 'bg-[#1DB954] text-black' : 'bg-[#282828] text-[#b3b3b3] border border-[#383838] hover:text-white'
                    }`}>
                    {dist}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Dong results */}
          {dongs.length > 0 && (
            <div className="space-y-3">
              <p className="text-[#727272] text-sm font-bold">{selectedCity} {selectedDistrict} — {dongs.length}개 동</p>
              {dongs.map((data, i) => <DongCard key={i} data={data} />)}
            </div>
          )}

          {selectedCity && !selectedDistrict && (
            <div className="bg-[#181818] rounded-2xl p-6 border border-[#282828] text-center">
              <p className="text-[#727272] text-sm">위에서 구(區)를 선택하세요</p>
            </div>
          )}

          {!selectedCity && (
            <div className="bg-[#181818] rounded-2xl p-6 border border-[#282828] text-center">
              <p className="text-[#727272] text-sm">시/도를 먼저 선택하세요</p>
            </div>
          )}
        </div>
      )}

      {/* 📅 입학 일정 탭 */}
      {activeTab === 'timeline' && (
        <div className="space-y-4">
          {/* Type legend */}
          <div className="bg-[#181818] rounded-2xl p-5 border border-[#282828]">
            <h3 className="font-black text-white mb-4">🏫 시설 유형별 특징</h3>
            <div className="space-y-3">
              {Object.entries(TYPE_CONFIG).map(([type, cfg]) => (
                <div key={type} className={`rounded-xl p-3 border ${cfg.bg} ${cfg.border} flex items-center justify-between`}>
                  <span className="font-bold text-sm" style={{ color: cfg.color }}>{type}</span>
                  <span className="text-xs text-[#727272]">
                    {type === '국공립유치원' && '무료 · 추첨제 · 10~11월 신청'}
                    {type === '사립유치원' && '월 20~90만원 · 선착순/추첨'}
                    {type === '국공립어린이집' && '무료(정부지원) · 대기제 · 아이사랑포털'}
                    {type === '민간어린이집' && '월 30~100만원 · 수시모집'}
                    {type === '가정어린이집' && '소규모(5~7명) · 개별돌봄 특화'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-[#181818] rounded-2xl p-5 border border-[#282828]">
            <h3 className="font-black text-white mb-4">📅 유치원 연간 입학 일정</h3>
            {[
              { month: '9~10월', icon: '🔍', title: '정보 수집 기간', desc: '유치원알리미에서 원 정보·비용·평가 결과 확인. 직접 원에 방문하거나 전화 상담 권장.' },
              { month: '10~11월', icon: '📝', title: '국공립 유치원 추첨 신청', desc: '거주지 교육청 공고 확인 후 온라인 신청. 시·도마다 일정 다름. 우선 순위: 형제자매 재원, 장애아, 한부모 등.' },
              { month: '11월', icon: '🎯', title: '추첨 결과 발표', desc: '당첨 시 기간 내 미등록하면 자동 취소! 등록금·서류 기한 엄수 필수.' },
              { month: '11~12월', icon: '🏃', title: '사립유치원·어린이집 개별 신청', desc: '국공립 탈락 시 바로 사립 지원. 선착순 마감 많으니 서두르세요!' },
              { month: '12월~1월', icon: '📋', title: '최종 입학 서류 제출', desc: '주민등록등본, 건강검진 결과 등 요청 서류 제출.' },
              { month: '2~3월', icon: '🌱', title: '입학·적응 기간', desc: '첫 2주는 적응 기간(단축보육). 분리불안 시 "엄마는 반드시 돌아온다"고 반복 안심시켜 주세요.' },
            ].map((item, i) => (
              <div key={i} className="flex items-start space-x-4 mb-4 last:mb-0">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-[#1DB954]/10 border-2 border-[#1DB954]/40 flex items-center justify-center text-lg shrink-0">
                    {item.icon}
                  </div>
                  {i < 5 && <div className="w-0.5 h-6 bg-[#282828] mt-2" />}
                </div>
                <div className="flex-1 pb-2">
                  <span className="text-[#1DB954] text-xs font-black bg-[#1DB954]/10 px-2.5 py-1 rounded-full border border-[#1DB954]/20">{item.month}</span>
                  <h4 className="font-black text-white mt-2 mb-1 text-sm">{item.title}</h4>
                  <p className="text-[#727272] text-xs leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#181818] rounded-2xl p-4 border border-[#f59e0b]/30">
            <p className="text-[#f59e0b] font-bold text-sm">⚠️ 데이터 안내</p>
            <p className="text-[#b3b3b3] text-xs mt-1 leading-relaxed">
              본 데이터는 대표 시설을 기반으로 작성된 <strong className="text-white">참고용 정보</strong>입니다. 
              정원·운영시간·비용은 변동될 수 있으니 입학 전 반드시 해당 시설에 직접 확인하세요.
              실제 빈자리 여부는 전화 문의를 권장합니다.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
