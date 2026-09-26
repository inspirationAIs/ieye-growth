// TCI (Temperament and Character Inventory) - 영유아 기질 체크리스트
export interface TemperamentQuestion {
  id: string;
  text: string;
  trait: TemperamentTrait;
}

export type TemperamentTrait = 'activity' | 'adaptability' | 'intensity' | 'mood' | 'persistence' | 'sensitivity' | 'sociability';

export interface TraitInfo {
  key: TemperamentTrait;
  label: string;
  emoji: string;
  lowLabel: string;  // 낮을 때 기질 설명
  highLabel: string; // 높을 때 기질 설명
  lowParentingTip: string[];
  highParentingTip: string[];
}

export const TRAIT_INFO: TraitInfo[] = [
  {
    key: 'activity',
    label: '활동 수준',
    emoji: '🏃',
    lowLabel: '차분한 편 (Low)',
    highLabel: '활동적인 편 (High)',
    lowParentingTip: [
      '조용한 놀이(블록, 그림그리기)를 충분히 제공하세요.',
      '야외 활동 시 차분한 자연 산책이 더 잘 맞습니다.',
      '강제로 활동량을 늘리려 하지 마세요. 이 아이의 속도를 존중해주세요.',
    ],
    highParentingTip: [
      '에너지를 충분히 발산할 수 있는 야외 놀이 시간을 매일 확보하세요.',
      '실내에서는 안전한 신체 놀이 공간을 마련해 주세요.',
      '정적인 활동(식사, 책 읽기) 전에 짧게 신체 활동을 먼저 하면 집중력이 높아집니다.',
    ],
  },
  {
    key: 'adaptability',
    label: '적응력',
    emoji: '🌊',
    lowLabel: '적응이 느린 편 (Low)',
    highLabel: '적응이 빠른 편 (High)',
    lowParentingTip: [
      '새로운 환경(어린이집, 새 음식)은 천천히, 미리 예고하며 경험하게 하세요.',
      '변화 전 충분한 예고와 설명이 중요합니다. "10분 후에 나갈 거야"처럼요.',
      '"처음엔 힘들어도 곧 괜찮아질 거야"라고 자주 말해주세요.',
    ],
    highParentingTip: [
      '새로운 환경에 잘 적응하는 아이입니다. 다양한 경험을 많이 제공하세요.',
      '적응을 너무 빨리 한다고 방심하지 말고 충분한 정착 시간을 주세요.',
    ],
  },
  {
    key: 'intensity',
    label: '반응 강도',
    emoji: '🌋',
    lowLabel: '조용하고 절제된 편 (Low)',
    highLabel: '감정 표현이 강렬한 편 (High)',
    lowParentingTip: [
      '감정 표현이 적다고 걱정하지 마세요. 이 아이만의 방식입니다.',
      '아이가 내면에서 느끼는 것을 "화가 났구나?" 라고 대신 표현해 주세요.',
    ],
    highParentingTip: [
      '기쁠 때도, 화날 때도 강렬하게 반응하는 아이입니다. 공감이 최우선입니다.',
      '"많이 속상했구나. 그 마음이 당연해"라고 먼저 공감한 뒤 규칙을 말하세요.',
      '공공장소에서의 강한 반응에 대비해 상황을 사전에 설명해두세요.',
    ],
  },
  {
    key: 'mood',
    label: '기분/정서성',
    emoji: '😊',
    lowLabel: '까다롭고 예민한 편 (Low)',
    highLabel: '긍정적이고 명랑한 편 (High)',
    lowParentingTip: [
      '"까다로운 아이"가 아닌 "예민하고 섬세한 아이"로 바라봐 주세요.',
      '일과를 규칙적으로 유지하면 아이의 기분이 안정됩니다.',
      '부모 자신도 스트레스 관리가 필요합니다. 아이의 기질은 부모 잘못이 아닙니다.',
    ],
    highParentingTip: [
      '명랑한 기질은 큰 강점입니다! 다양한 사회적 경험을 제공하세요.',
      '기분이 좋다고 위험한 행동에 무감각해질 수 있으니 안전 교육을 잘 시켜주세요.',
    ],
  },
  {
    key: 'persistence',
    label: '지속성/집중력',
    emoji: '🎯',
    lowLabel: '쉽게 포기하는 편 (Low)',
    highLabel: '고집스럽게 지속하는 편 (High)',
    lowParentingTip: [
      '쉽게 포기한다고 혼내지 마세요. 짧은 목표를 설정해 성취감을 쌓아주세요.',
      '퍼즐, 블록 등 단계별 성공이 있는 놀이가 지속성 발달에 도움됩니다.',
    ],
    highParentingTip: [
      '"이제 그만해"가 통하지 않는 아이입니다. 전환 5분 전에 미리 예고해주세요.',
      '한 가지를 끝까지 해내는 것이 강점이 될 수 있습니다. 긍정적으로 봐주세요.',
    ],
  },
  {
    key: 'sensitivity',
    label: '감각 예민성',
    emoji: '👂',
    lowLabel: '감각에 둔감한 편 (Low)',
    highLabel: '감각이 예민한 편 (High)',
    lowParentingTip: [
      '통증이나 불편함을 잘 표현하지 못할 수 있으니 몸 상태를 자주 체크해주세요.',
    ],
    highParentingTip: [
      '옷 태그, 음식 질감, 큰 소리 등에 예민하게 반응할 수 있습니다. 미리 배려해주세요.',
      '새 옷은 세탁 후 입히고, 태그를 제거하는 것이 도움됩니다.',
      '감각 예민성은 예술적 감수성과 연결되기도 합니다.',
    ],
  },
  {
    key: 'sociability',
    label: '사회성/낯가림',
    emoji: '👥',
    lowLabel: '낯을 많이 가리는 편 (Low)',
    highLabel: '낯을 잘 가리지 않는 편 (High)',
    lowParentingTip: [
      '처음 만나는 사람 앞에서 서두르지 마세요. 충분한 관찰 시간을 주세요.',
      '"낯선 사람한테 인사해"라는 압박은 오히려 역효과입니다.',
      '소규모 플레이데이트(1:1 만남)부터 시작하는 것이 효과적입니다.',
    ],
    highParentingTip: [
      '사교적인 것이 큰 장점입니다! 다양한 또래 경험을 제공하세요.',
      '낯선 사람에게 지나치게 친근하게 굴지 않도록 "안전한 어른" 개념을 가르쳐 주세요.',
    ],
  },
];

export const TEMPERAMENT_QUESTIONS: TemperamentQuestion[] = [
  { id: 'q1', trait: 'activity', text: '하루 종일 돌아다니거나 뛰어다니려 합니까?' },
  { id: 'q2', trait: 'activity', text: '앉아서 책 읽기나 조용한 놀이를 즐깁니까?' },
  { id: 'q3', trait: 'adaptability', text: '새로운 음식, 장소, 사람을 빠르게 받아들입니까?' },
  { id: 'q4', trait: 'adaptability', text: '일과 변화(갑자기 외출, 낮잠 취소)에 잘 적응합니까?' },
  { id: 'q5', trait: 'intensity', text: '기쁘거나 신날 때 큰 소리로 웃거나 소리를 지릅니까?' },
  { id: 'q6', trait: 'intensity', text: '화나거나 속상할 때 강하게 울거나 떼를 씁니까?' },
  { id: 'q7', trait: 'mood', text: '대체로 기분이 긍정적이고 잘 웃는 편입니까?' },
  { id: 'q8', trait: 'mood', text: '작은 일에도 쉽게 칭얼거리거나 불평합니까?' },
  { id: 'q9', trait: 'persistence', text: '좋아하는 놀이를 한번 시작하면 오래 집중합니까?' },
  { id: 'q10', trait: 'persistence', text: '어려운 것이 생기면 금방 포기하고 다른 것을 찾습니까?' },
  { id: 'q11', trait: 'sensitivity', text: '큰 소리나 갑작스러운 소리에 깜짝 놀라거나 울기도 합니까?' },
  { id: 'q12', trait: 'sensitivity', text: '옷의 태그, 이음새, 음식 질감을 매우 싫어합니까?' },
  { id: 'q13', trait: 'sociability', text: '처음 보는 사람에게도 잘 다가가고 말을 겁니까?' },
  { id: 'q14', trait: 'sociability', text: '낯선 환경에서 부모 곁을 떠나지 않으려 합니까?' },
];

export function calculateTemperament(responses: Record<string, number>): Record<TemperamentTrait, number> {
  const scores: Record<string, number[]> = {};
  
  for (const q of TEMPERAMENT_QUESTIONS) {
    if (!scores[q.trait]) scores[q.trait] = [];
    scores[q.trait].push(responses[q.id] ?? 2);
  }
  
  const result: Record<string, number> = {};
  for (const [trait, vals] of Object.entries(scores)) {
    result[trait] = Math.round((vals.reduce((a, b) => a + b, 0) / vals.length / 4) * 100);
  }
  
  return result as Record<TemperamentTrait, number>;
}
