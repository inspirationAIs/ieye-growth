// 한국 표준 예방접종 일정 (질병관리청 기준)
export interface Vaccine {
  name: string;
  nameEn: string;
  disease: string;
  emoji: string;
  color: string;
  doses: {
    label: string;
    ageMonth: number; // 권장 개월 수
    ageLabel: string;
  }[];
}

export const VACCINES: Vaccine[] = [
  {
    name: 'B형간염',
    nameEn: 'HepB',
    disease: 'B형 간염',
    emoji: '💉',
    color: '#1DB954',
    doses: [
      { label: '1차', ageMonth: 0, ageLabel: '출생 시' },
      { label: '2차', ageMonth: 1, ageLabel: '생후 1개월' },
      { label: '3차', ageMonth: 6, ageLabel: '생후 6개월' },
    ],
  },
  {
    name: 'BCG',
    nameEn: 'BCG',
    disease: '결핵',
    emoji: '💉',
    color: '#3b82f6',
    doses: [
      { label: '1차', ageMonth: 1, ageLabel: '생후 4주 이내' },
    ],
  },
  {
    name: 'DTaP',
    nameEn: 'DTaP',
    disease: '디프테리아/파상풍/백일해',
    emoji: '💉',
    color: '#f59e0b',
    doses: [
      { label: '1차', ageMonth: 2, ageLabel: '생후 2개월' },
      { label: '2차', ageMonth: 4, ageLabel: '생후 4개월' },
      { label: '3차', ageMonth: 6, ageLabel: '생후 6개월' },
      { label: '4차', ageMonth: 15, ageLabel: '생후 15~18개월' },
      { label: '5차', ageMonth: 48, ageLabel: '만 4~6세' },
    ],
  },
  {
    name: 'IPV',
    nameEn: 'IPV',
    disease: '폴리오',
    emoji: '💉',
    color: '#8b5cf6',
    doses: [
      { label: '1차', ageMonth: 2, ageLabel: '생후 2개월' },
      { label: '2차', ageMonth: 4, ageLabel: '생후 4개월' },
      { label: '3차', ageMonth: 6, ageLabel: '생후 6~18개월' },
      { label: '4차', ageMonth: 48, ageLabel: '만 4~6세' },
    ],
  },
  {
    name: 'Hib',
    nameEn: 'Hib',
    disease: '뇌수막염(b형 헤모필루스 인플루엔자)',
    emoji: '💉',
    color: '#ec4899',
    doses: [
      { label: '1차', ageMonth: 2, ageLabel: '생후 2개월' },
      { label: '2차', ageMonth: 4, ageLabel: '생후 4개월' },
      { label: '3차', ageMonth: 6, ageLabel: '생후 6개월' },
      { label: '4차', ageMonth: 12, ageLabel: '생후 12~15개월' },
    ],
  },
  {
    name: 'PCV',
    nameEn: 'PCV13',
    disease: '폐렴구균',
    emoji: '💉',
    color: '#14b8a6',
    doses: [
      { label: '1차', ageMonth: 2, ageLabel: '생후 2개월' },
      { label: '2차', ageMonth: 4, ageLabel: '생후 4개월' },
      { label: '3차', ageMonth: 6, ageLabel: '생후 6개월' },
      { label: '4차', ageMonth: 12, ageLabel: '생후 12~15개월' },
    ],
  },
  {
    name: 'RV',
    nameEn: 'Rotavirus',
    disease: '로타바이러스 장염',
    emoji: '💊',
    color: '#f97316',
    doses: [
      { label: '1차', ageMonth: 2, ageLabel: '생후 2개월' },
      { label: '2차', ageMonth: 4, ageLabel: '생후 4개월' },
      { label: '3차', ageMonth: 6, ageLabel: '생후 6개월 (5가만)' },
    ],
  },
  {
    name: 'MMR',
    nameEn: 'MMR',
    disease: '홍역/유행성이하선염/풍진',
    emoji: '💉',
    color: '#ef4444',
    doses: [
      { label: '1차', ageMonth: 12, ageLabel: '생후 12~15개월' },
      { label: '2차', ageMonth: 48, ageLabel: '만 4~6세' },
    ],
  },
  {
    name: '수두',
    nameEn: 'VAR',
    disease: '수두',
    emoji: '💉',
    color: '#a855f7',
    doses: [
      { label: '1차', ageMonth: 12, ageLabel: '생후 12~15개월' },
    ],
  },
  {
    name: 'A형간염',
    nameEn: 'HepA',
    disease: 'A형 간염',
    emoji: '💉',
    color: '#6366f1',
    doses: [
      { label: '1차', ageMonth: 12, ageLabel: '생후 12~23개월' },
      { label: '2차', ageMonth: 18, ageLabel: '1차 접종 후 6개월' },
    ],
  },
  {
    name: 'IJEV',
    nameEn: 'JEV',
    disease: '일본뇌염',
    emoji: '💉',
    color: '#0ea5e9',
    doses: [
      { label: '1차', ageMonth: 12, ageLabel: '생후 12개월' },
      { label: '2차', ageMonth: 13, ageLabel: '1차 후 1~2주' },
      { label: '3차', ageMonth: 24, ageLabel: '2차 후 12개월' },
      { label: '4차', ageMonth: 72, ageLabel: '만 6세' },
      { label: '5차', ageMonth: 132, ageLabel: '만 12세' },
    ],
  },
  {
    name: 'Td/Tdap',
    nameEn: 'Td/Tdap',
    disease: '파상풍/디프테리아/백일해 추가',
    emoji: '💉',
    color: '#84cc16',
    doses: [
      { label: '추가', ageMonth: 132, ageLabel: '만 11~12세' },
    ],
  },
];

export interface VaccineDoseStatus {
  vaccine: Vaccine;
  dose: Vaccine['doses'][0];
  status: 'done' | 'upcoming' | 'overdue';
  dueDate: Date;
  daysFromNow: number;
}

export function getVaccineSchedule(birthdate: string): VaccineDoseStatus[] {
  const birth = new Date(birthdate);
  const now = new Date();
  const results: VaccineDoseStatus[] = [];

  for (const vaccine of VACCINES) {
    for (const dose of vaccine.doses) {
      const dueDate = new Date(birth);
      dueDate.setMonth(dueDate.getMonth() + dose.ageMonth);
      
      const daysFromNow = Math.floor((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      let status: VaccineDoseStatus['status'];
      if (daysFromNow < -30) {
        status = 'done'; // 30일 이상 지남 → 완료로 간주
      } else if (daysFromNow < 0) {
        status = 'overdue'; // 30일 이내 지남 → 지연 (아직 맞을 수 있음)
      } else {
        status = 'upcoming';
      }

      results.push({ vaccine, dose, status, dueDate, daysFromNow });
    }
  }

  return results.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
}
