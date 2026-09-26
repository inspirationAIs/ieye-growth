'use client';
import { useState } from 'react';
import { KDST_PERIODS, DOMAIN_LABELS, MILESTONE_DATA } from '@/data/kdst';
import type { DomainKey } from '@/types';

const ALL_DOMAIN_KEY = 'all' as const;
type DomainFilter = DomainKey | typeof ALL_DOMAIN_KEY;

export default function MilestonesPage() {
  const [selectedPeriod, setSelectedPeriod] = useState(8);
  const [domainFilter, setDomainFilter] = useState<DomainFilter>(ALL_DOMAIN_KEY);

  const period = KDST_PERIODS.find((p) => p.period === selectedPeriod)!;
  const milestone = MILESTONE_DATA.find((m) => m.period === selectedPeriod);

  const filteredQuestions = domainFilter === ALL_DOMAIN_KEY
    ? period.questions
    : period.questions.filter((q) => q.domain === domainFilter);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black text-white">📘 월령별 발달 표준</h1>
        <p className="text-[#727272] text-sm mt-1">KDST 기반 시기별 평가 항목과 심리·양육 가이드를 확인하세요.</p>
      </div>

      {/* Period Selector */}
      <div className="bg-[#181818] rounded-2xl p-4 border border-[#282828]">
        <h3 className="text-xs font-bold text-[#727272] mb-3 uppercase tracking-wider">검진 차수 선택</h3>
        <div className="flex flex-wrap gap-2">
          {KDST_PERIODS.map((p) => (
            <button
              key={p.period}
              onClick={() => setSelectedPeriod(p.period)}
              className={`px-3 py-2 rounded-full text-xs font-bold transition-all ${
                selectedPeriod === p.period
                  ? 'bg-[#1DB954] text-black'
                  : 'bg-[#282828] text-[#b3b3b3] hover:bg-[#383838] hover:text-white'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Domain Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setDomainFilter(ALL_DOMAIN_KEY)}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
            domainFilter === ALL_DOMAIN_KEY
              ? 'bg-white text-black'
              : 'bg-[#282828] text-[#b3b3b3] border border-[#383838] hover:bg-[#383838]'
          }`}
        >
          전체
        </button>
        {DOMAIN_LABELS.map((d) => (
          <button
            key={d.key}
            onClick={() => setDomainFilter(d.key)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              domainFilter === d.key ? 'text-black' : 'bg-[#282828] text-[#b3b3b3] border border-[#383838] hover:bg-[#383838]'
            }`}
            style={domainFilter === d.key ? { backgroundColor: d.color } : {}}
          >
            {d.emoji} {d.label}
          </button>
        ))}
      </div>

      {/* Period Info Card */}
      <div className="bg-[#181818] rounded-2xl p-5 border border-[#1DB954]/20">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-black text-white">{period.label}</h2>
            <p className="text-[#1DB954] text-sm mt-0.5">생후 {period.ageRange[0]}~{period.ageRange[1]}개월</p>
          </div>
          <span className="bg-[#1DB954]/10 text-[#1DB954] text-xs font-bold px-3 py-1.5 rounded-full border border-[#1DB954]/30">
            평가 {period.questions.length}개 항목
          </span>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-3">
        <h3 className="font-black text-[#b3b3b3] text-sm uppercase tracking-wider">평가 항목 ({filteredQuestions.length}개)</h3>
        {filteredQuestions.map((q, i) => {
          const domain = DOMAIN_LABELS.find((d) => d.key === q.domain)!;
          return (
            <div key={q.id} className="bg-[#181818] rounded-2xl p-4 border border-[#282828] hover:border-[#383838] transition-all">
              <div className="flex items-start space-x-3">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-black text-sm font-bold shrink-0"
                  style={{ backgroundColor: domain.color }}
                >
                  {domain.emoji}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-xs font-bold" style={{ color: domain.color }}>{domain.label}</span>
                    <span className="text-[#383838]">|</span>
                    <span className="text-xs text-[#535353]">문항 {i + 1}</span>
                  </div>
                  <p className="font-bold text-white text-sm">{q.text}</p>
                  {q.tip && (
                    <p className="text-xs text-[#727272] mt-1.5 bg-[#282828] px-2.5 py-1.5 rounded-lg">💡 {q.tip}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Milestone & Psychology Notes */}
      {milestone && (
        <div className="bg-[#181818] rounded-2xl p-6 border border-[#282828] space-y-4">
          <h3 className="font-black text-white text-lg">🧠 심리 발달 특징 & 양육 팁</h3>
          {milestone.domains.map((d) => {
            const domainInfo = DOMAIN_LABELS.find((dl) => dl.key === d.domain)!;
            return (
              <div key={d.domain} className="rounded-2xl p-4 border border-[#383838] bg-[#282828]"
                style={{ borderLeftColor: domainInfo.color, borderLeftWidth: 3 }}>
                <div className="flex items-center space-x-2 mb-2">
                  <span>{domainInfo.emoji}</span>
                  <span className="font-bold text-sm" style={{ color: domainInfo.color }}>{domainInfo.label} 영역 심리 특징</span>
                </div>
                <p className="text-xs text-[#b3b3b3] leading-relaxed">{d.psychologicalNote}</p>
                <ul className="mt-2 space-y-1">
                  {d.milestones.map((m, i) => (
                    <li key={i} className="text-xs text-[#727272] flex items-start space-x-1.5">
                      <span style={{ color: domainInfo.color }}>✓</span>
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
          <div>
            <h4 className="font-black text-[#b3b3b3] text-sm mb-2 uppercase tracking-wider">💡 양육 팁</h4>
            {milestone.parentingTips.map((tip, i) => (
              <div key={i} className="flex items-start space-x-2 text-xs text-[#b3b3b3] bg-[#1DB954]/5 border border-[#1DB954]/10 rounded-xl p-3 mb-2">
                <span className="text-[#1DB954] font-black shrink-0">{i + 1}.</span>
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
