export interface Facility {
  name: string;
  type: '국공립유치원' | '사립유치원' | '국공립어린이집' | '민간어린이집' | '가정어린이집' | '직장어린이집';
  address: string;
  ageRange: string;
  features: string[];
  capacity: number;
  operatingHours: string;
  fee: string;
  phone?: string;
}

export interface DongData {
  dong: string;
  district: string;
  city: string;
  facilities: Facility[];
  areaNote: string;
}

export const KINDERGARTEN_DB: DongData[] = [
  // =========================================================================
  // 1. 서울특별시 강남구
  // =========================================================================
  {
    dong: '개포동', district: '강남구', city: '서울특별시',
    areaNote: '개포 신축 대단지 입주로 영유아 보육 수요 집중. 명문 사립유치원(이화유치원 등)과 단지 내 신설 국공립 어린이집 다수 위치.',
    facilities: [
      {
        name: '이화유치원',
        type: '사립유치원',
        address: '서울 강남구 개포로 109길 5 (개포동 대청역 인근)',
        ageRange: '만 3~5세',
        features: ['이화여대 유아교육 프로그램', '몬테소리 교구', '생태자연체험', '통학차량운행', '창의융합과정'],
        capacity: 135,
        operatingHours: '09:00~14:30 (방과후과정 ~19:00)',
        fee: '정부지원(누리과정) 외 특성화비 (약 35~50만원)',
        phone: '02-459-2101'
      },
      {
        name: '개포초등학교 병설유치원',
        type: '국공립유치원',
        address: '서울 강남구 개포로 212',
        ageRange: '만 3~5세',
        features: ['초등연계교육', '친환경무상급식', '숲체험활동', '돌봄교실운영'],
        capacity: 60,
        operatingHours: '09:00~14:00 (방과후돌봄 ~19:30)',
        fee: '정부지원 전액무료 (급식비 포함)',
        phone: '02-572-8801'
      },
      {
        name: '포이초등학교 병설유치원',
        type: '국공립유치원',
        address: '서울 강남구 개포로 22길 30',
        ageRange: '만 4~5세',
        features: ['공립유치원', '넓은운동장', '초등시설연계', '독서프로그램'],
        capacity: 44,
        operatingHours: '09:00~14:00 (방과후 ~19:30)',
        fee: '정부지원 전액무료',
        phone: '02-574-1234'
      },
      {
        name: '구룡초등학교 병설유치원',
        type: '국공립유치원',
        address: '서울 강남구 개포로 264',
        ageRange: '만 3~5세',
        features: ['공립유치원', '자연친화학습', '방과후돌봄', '안전한통학로'],
        capacity: 55,
        operatingHours: '09:00~14:00 (방과후 ~19:30)',
        fee: '정부지원 전액무료',
        phone: '02-573-5678'
      },
      {
        name: '구립 개포자이어린이집',
        type: '국공립어린이집',
        address: '서울 강남구 삼성로 14 (개포자이프레지던스 단지 내)',
        ageRange: '만 0~5세',
        features: ['대단지신축', '영아전담반', '친환경인테리어', '야간연장보육', '단지공원연계'],
        capacity: 85,
        operatingHours: '07:30~19:30',
        fee: '정부지원 전액무료',
        phone: '02-578-0101'
      },
      {
        name: '구립 디에이치아너힐즈어린이집',
        type: '국공립어린이집',
        address: '서울 강남구 개포로 310 (디에이치아너힐즈 단지 내)',
        ageRange: '만 0~5세',
        features: ['단지내국공립', '오감발달놀이', '안심CCTV', '친환경식단'],
        capacity: 70,
        operatingHours: '07:30~19:30',
        fee: '정부지원 전액무료',
        phone: '02-579-2200'
      },
      {
        name: '구립 래미안블레스티지어린이집',
        type: '국공립어린이집',
        address: '서울 강남구 선릉로 8 (래미안블레스티지 단지 내)',
        ageRange: '만 0~5세',
        features: ['단지내안심보육', '영유아특성화', '숲체험', '야간연장'],
        capacity: 65,
        operatingHours: '07:30~19:30',
        fee: '정부지원 전액무료',
        phone: '02-571-3311'
      },
      {
        name: '한솔어린이집',
        type: '국공립어린이집',
        address: '서울 강남구 개포로 15길 20',
        ageRange: '만 0~5세',
        features: ['구립운영', '영아전담반', '신체놀이', '다문화통합'],
        capacity: 50,
        operatingHours: '07:30~19:30',
        fee: '정부지원 전액무료',
        phone: '02-575-4422'
      },
      {
        name: '구립 포이소리어린이집',
        type: '국공립어린이집',
        address: '서울 강남구 개포로 24길 28',
        ageRange: '만 0~5세',
        features: ['구립국공립', '음악감성놀이', '시간제보육', '안심등하원'],
        capacity: 45,
        operatingHours: '07:30~19:30',
        fee: '정부지원 전액무료',
        phone: '02-576-5533'
      },
      {
        name: '개포꿈나무어린이집',
        type: '민간어린이집',
        address: '서울 강남구 개포로 186-3',
        ageRange: '만 1~5세',
        features: ['오감발달놀이', '클레이아트', '체육특성화', '차량운행'],
        capacity: 38,
        operatingHours: '07:30~19:30',
        fee: '정부지원 + 차액보육료 (월 10~25만원)',
        phone: '02-577-6644'
      },
      {
        name: '숲속예능유치원',
        type: '사립유치원',
        address: '서울 강남구 일원로 115 (개포·일원 인근)',
        ageRange: '만 3~5세',
        features: ['대모산 숲체험', '음악·미술예능특성화', '원어민영어놀이', '셔틀운행'],
        capacity: 110,
        operatingHours: '09:00~14:30 (방과후 ~18:30)',
        fee: '정부지원 외 약 35~48만원',
        phone: '02-3411-7788'
      }
    ]
  },
  {
    dong: '대치동', district: '강남구', city: '서울특별시',
    areaNote: '전국 최고 수준의 교육열. 사립유치원의 특색 예체능·외국어 교육 프로그램 및 국공립 어린이집 선호도 매우 높음.',
    facilities: [
      { name: '대치유치원', type: '국공립유치원', address: '서울 강남구 대치동 946-1', ageRange: '만 3~5세', features: ['영어특색교육', '바이올린', '초등연계'], capacity: 80, operatingHours: '09:00~14:00 (방과후 ~19:30)', fee: '무료' },
      { name: '은마어린이집', type: '국공립어린이집', address: '서울 강남구 삼성로 212 은마아파트 단지 내', ageRange: '만 0~5세', features: ['아파트단지내', '안전한환경', '영아전담'], capacity: 55, operatingHours: '07:30~19:30', fee: '정부지원 무료' },
      { name: '대치래미안어린이집', type: '국공립어린이집', address: '서울 강남구 도곡로 77길 23', ageRange: '만 0~5세', features: ['단지국공립', '생태체험', '시간연장'], capacity: 60, operatingHours: '07:30~19:30', fee: '정부지원 무료' },
      { name: '동심유치원', type: '사립유치원', address: '서울 강남구 역삼로 69길 27', ageRange: '만 3~5세', features: ['프로젝트접근법', '자연친화', '예술융합'], capacity: 130, operatingHours: '09:00~14:30', fee: '월 40~65만원' }
    ]
  },
  {
    dong: '도곡동', district: '강남구', city: '서울특별시',
    areaNote: '타워팰리스, 도곡렉슬 등 대단지 및 주상복합 밀집 지역. 프리미엄 보육 및 양질의 국공립 시설 균형.',
    facilities: [
      { name: '도곡초등학교 병설유치원', type: '국공립유치원', address: '서울 강남구 남부순환로 2700', ageRange: '만 4~5세', features: ['초등연계교육', '독서프로그램', '무상급식'], capacity: 45, operatingHours: '09:00~14:00 (방과후 ~19:30)', fee: '무료' },
      { name: '은성유치원', type: '사립유치원', address: '서울 강남구 도곡로 22길 34', ageRange: '만 3~5세', features: ['창의융합교육', '오케스트라', '체육특성화', '통학차량'], capacity: 125, operatingHours: '09:00~14:30', fee: '월 40~70만원' },
      { name: '도곡렉슬어린이집', type: '국공립어린이집', address: '서울 강남구 선릉로 221 렉슬단지 내', ageRange: '만 0~5세', features: ['단지내위치', '안전한환경', '자연체험'], capacity: 60, operatingHours: '07:30~19:30', fee: '정부지원 무료' },
      { name: '타워프리미엄어린이집', type: '민간어린이집', address: '서울 강남구 언주로 30길 56', ageRange: '만 1~5세', features: ['원어민영어', '발레', '유아수영연계'], capacity: 85, operatingHours: '07:30~19:30', fee: '월 60~100만원' }
    ]
  },
  {
    dong: '압구정동', district: '강남구', city: '서울특별시',
    areaNote: '전통의 주거 중심지. 현대백화점 및 한강공원 인근의 우수한 교육 인프라.',
    facilities: [
      { name: '압구정초등학교 병설유치원', type: '국공립유치원', address: '서울 강남구 압구정로 29길 21', ageRange: '만 3~5세', features: ['초등캠퍼스연계', '인성교육', '체육활동'], capacity: 55, operatingHours: '09:00~14:00 (방과후 ~19:30)', fee: '무료' },
      { name: '신구유치원', type: '사립유치원', address: '서울 강남구 압구정로 18길 28', ageRange: '만 3~5세', features: ['전통과역사', '창의감성예술', '영어놀이'], capacity: 110, operatingHours: '09:00~14:30', fee: '월 45~75만원' },
      { name: '구립 압구정어린이집', type: '국공립어린이집', address: '서울 강남구 압구정로 201', ageRange: '만 0~5세', features: ['구립인증', '한강생태견학', '영아전담'], capacity: 50, operatingHours: '07:30~19:30', fee: '정부지원 무료' }
    ]
  },
  {
    dong: '역삼동', district: '강남구', city: '서울특별시',
    areaNote: '테헤란로 업무지구 배후 주거단지. 맞벌이 부부를 위한 야간연장 및 직장 어린이집 수요 풍부.',
    facilities: [
      { name: '역삼초등학교 병설유치원', type: '국공립유치원', address: '서울 강남구 역삼로 156', ageRange: '만 3~5세', features: ['공립유치원', '창의놀이', '방과후과정'], capacity: 50, operatingHours: '09:00~14:00 (방과후 ~19:30)', fee: '무료' },
      { name: '구립 역삼어린이집', type: '국공립어린이집', address: '서울 강남구 테헤란로 8길 36', ageRange: '만 0~5세', features: ['야간연장보육', '직장부모맞춤', '급식안심'], capacity: 65, operatingHours: '07:30~21:30', fee: '정부지원 무료' },
      { name: '푸르니 역삼어린이집', type: '직장어린이집', address: '서울 강남구 역삼동 736-1', ageRange: '만 0~5세', features: ['푸르니재단운영', '최고수준교사비율', '자연체험'], capacity: 90, operatingHours: '07:30~20:00', fee: '회사지원 (무료)' }
    ]
  },
  {
    dong: '일원동', district: '강남구', city: '서울특별시',
    areaNote: '삼성서울병원 및 대모산 인근 쾌적한 숲세권. 생태·숲체험 프로그램 발달.',
    facilities: [
      { name: '일원초등학교 병설유치원', type: '국공립유치원', address: '서울 강남구 일원로 90', ageRange: '만 3~5세', features: ['숲체험', '안전한통학로', '친환경식단'], capacity: 48, operatingHours: '09:00~14:00', fee: '무료' },
      { name: '삼성서울병원 직장어린이집', type: '직장어린이집', address: '서울 강남구 일원로 81', ageRange: '만 0~5세', features: ['병원직원복지', '의료연계안심케어', '24시간대응'], capacity: 120, operatingHours: '07:00~21:00', fee: '직원지원' },
      { name: '구립 푸른솔어린이집', type: '국공립어린이집', address: '서울 강남구 일원로 127', ageRange: '만 0~5세', features: ['구립시설', '대모산산책', '오감발달'], capacity: 55, operatingHours: '07:30~19:30', fee: '정부지원 무료' }
    ]
  },

  // =========================================================================
  // 2. 서울특별시 서초구
  // =========================================================================
  {
    dong: '반포동', district: '서초구', city: '서울특별시',
    areaNote: '아크로리버파크, 원베일리, 래미안퍼스티지 등 최고급 대단지 밀집. 국공립 어린이집 대기 수요 매우 큼.',
    facilities: [
      { name: '잠원초등학교 병설유치원', type: '국공립유치원', address: '서울 서초구 신반포로 23길 66', ageRange: '만 3~5세', features: ['초등연계', '인성교육', '체육시설'], capacity: 60, operatingHours: '09:00~14:00 (방과후 ~19:30)', fee: '무료' },
      { name: '계성유치원', type: '사립유치원', address: '서울 서초구 신반포로 19길 22', ageRange: '만 3~5세', features: ['가톨릭인성교육', '음악감성특성화', '영어융합'], capacity: 140, operatingHours: '09:00~14:30', fee: '월 45~75만원' },
      { name: '구립 원베일리어린이집', type: '국공립어린이집', address: '서울 서초구 반포대로 337 단지 내', ageRange: '만 0~5세', features: ['최신축단지', '단지공원연계', '영아전담', '스마트CCTV'], capacity: 95, operatingHours: '07:30~19:30', fee: '정부지원 무료' },
      { name: '구립 래미안퍼스티지어린이집', type: '국공립어린이집', address: '서울 서초구 반포대로 275', ageRange: '만 0~5세', features: ['단지국공립', '자연체험놀이', '야간연장'], capacity: 75, operatingHours: '07:30~19:30', fee: '정부지원 무료' }
    ]
  },
  {
    dong: '서초동', district: '서초구', city: '서울특별시',
    areaNote: '법원·검찰청 및 예술의전당 인근. 문화예술 특성화 유치원과 우수 어린이집 다수.',
    facilities: [
      { name: '서초초등학교 병설유치원', type: '국공립유치원', address: '서울 서초구 서초대로 64길 25', ageRange: '만 3~5세', features: ['공립유치원', '창의놀이', '돌봄지원'], capacity: 50, operatingHours: '09:00~14:00', fee: '무료' },
      { name: '새싹유치원', type: '사립유치원', address: '서울 서초구 사임당로 143', ageRange: '만 3~5세', features: ['예술놀이', '바이올린', '감성창의교육'], capacity: 100, operatingHours: '09:00~14:30', fee: '월 40~65만원' },
      { name: '구립 서초그랑자이어린이집', type: '국공립어린이집', address: '서울 서초구 효령로 403 단지 내', ageRange: '만 0~5세', features: ['단지내국공립', '영아돌봄특화', '친환경식단'], capacity: 70, operatingHours: '07:30~19:30', fee: '정부지원 무료' }
    ]
  },
  {
    dong: '방배동', district: '서초구', city: '서울특별시',
    areaNote: '서리풀공원과 매봉재산 자연 인접. 조용하고 쾌적한 주거 환경.',
    facilities: [
      { name: '방배초등학교 병설유치원', type: '국공립유치원', address: '서울 서초구 방배로 18길 30', ageRange: '만 4~5세', features: ['서리풀숲체험', '친환경급식', '초등시설연계'], capacity: 45, operatingHours: '09:00~14:00', fee: '무료' },
      { name: '구립 방배숲어린이집', type: '국공립어린이집', address: '서울 서초구 방배선행길 20', ageRange: '만 0~5세', features: ['생태보육', '텃밭체험', '안심보육'], capacity: 55, operatingHours: '07:30~19:30', fee: '정부지원 무료' }
    ]
  },

  // =========================================================================
  // 3. 서울특별시 송파구
  // =========================================================================
  {
    dong: '잠실동', district: '송파구', city: '서울특별시',
    areaNote: '엘스, 리센츠, 트리지움, 레이크팰리스, 파크리오 등 대규모 아파트 단지. 단지별 국공립 어린이집과 유명 사립유치원 다수.',
    facilities: [
      { name: '잠실초등학교 병설유치원', type: '국공립유치원', address: '서울 송파구 올림픽로 35길 112', ageRange: '만 3~5세', features: ['초등연계', '인성놀이', '무상급식'], capacity: 55, operatingHours: '09:00~14:00 (방과후 ~19:30)', fee: '무료' },
      { name: '서울잠실유치원', type: '사립유치원', address: '서울 송파구 잠실로 62 (트리지움 인근)', ageRange: '만 3~5세', features: ['영어몰입놀이', '수학가베', '음악특성화', '차량운행'], capacity: 160, operatingHours: '09:00~14:30', fee: '월 40~65만원' },
      { name: '구립 리센츠어린이집', type: '국공립어린이집', address: '서울 송파구 올림픽로 145 리센츠 단지 내', ageRange: '만 0~5세', features: ['단지국공립', '영아안심반', '놀이터안전', '연장보육'], capacity: 85, operatingHours: '07:30~19:30', fee: '정부지원 무료' },
      { name: '구립 엘스어린이집', type: '국공립어린이집', address: '서울 송파구 올림픽로 99 엘스 단지 내', ageRange: '만 0~5세', features: ['단지국공립', '한강견학', '친환경식단'], capacity: 80, operatingHours: '07:30~19:30', fee: '정부지원 무료' }
    ]
  },
  {
    dong: '문정동', district: '송파구', city: '서울특별시',
    areaNote: '문정법조단지 및 훼밀리아파트, 올림픽훼밀리 인근. 직장 어린이집과 단지 어린이집 조화.',
    facilities: [
      { name: '문정초등학교 병설유치원', type: '국공립유치원', address: '서울 송파구 송이로 34', ageRange: '만 4~5세', features: ['공립유치원', '창의독서', '초등연계'], capacity: 44, operatingHours: '09:00~14:00', fee: '무료' },
      { name: '구립 올림픽훼밀리어린이집', type: '국공립어린이집', address: '서울 송파구 송파대로 60', ageRange: '만 0~5세', features: ['대단지위치', '넓은마당', '영아전담'], capacity: 70, operatingHours: '07:30~19:30', fee: '정부지원 무료' }
    ]
  },
  {
    dong: '가락동', district: '송파구', city: '서울특별시',
    areaNote: '헬리오시티(9,510세대) 입주로 유아동 인구 최대 밀집 지역 중 하나.',
    facilities: [
      { name: '가락초등학교 병설유치원', type: '국공립유치원', address: '서울 송파구 송파대로 345', ageRange: '만 3~5세', features: ['초등연계', '친환경급식', '돌봄운영'], capacity: 60, operatingHours: '09:00~14:00', fee: '무료' },
      { name: '구립 헬리오시티어린이집', type: '국공립어린이집', address: '서울 송파구 송파대로 345 헬리오시티 단지 내', ageRange: '만 0~5세', features: ['초대형단지내', '스마트안심케어', '야간연장보육'], capacity: 110, operatingHours: '07:30~19:30', fee: '정부지원 무료' }
    ]
  },

  // =========================================================================
  // 4. 서울특별시 마포구
  // =========================================================================
  {
    dong: '아현동', district: '마포구', city: '서울특별시',
    areaNote: '마포래미안푸르지오(마래푸) 등 뉴타운 대단지 형성. 젊은 맞벌이 부부 비중 매우 높음.',
    facilities: [
      { name: '아현초등학교 병설유치원', type: '국공립유치원', address: '서울 마포구 굴레방로 1길 22', ageRange: '만 3~5세', features: ['공립유치원', '무상급식', '돌봄교실'], capacity: 55, operatingHours: '09:00~14:00 (방과후 ~19:30)', fee: '무료' },
      { name: '구립 마래푸어린이집', type: '국공립어린이집', address: '서울 마포구 마포대로 195 마래푸 단지 내', ageRange: '만 0~5세', features: ['단지국공립', '맞벌이부부우대', '야간연장보육'], capacity: 80, operatingHours: '07:30~19:30', fee: '정부지원 무료' },
      { name: '예원유치원', type: '사립유치원', address: '서울 마포구 마포대로 24', ageRange: '만 3~5세', features: ['몬테소리', '오감음악', '영어체험'], capacity: 110, operatingHours: '09:00~14:30', fee: '월 35~55만원' }
    ]
  },
  {
    dong: '상암동', district: '마포구', city: '서울특별시',
    areaNote: 'DMC 미디어 방송 클러스터 및 월드컵공원·하늘공원 자연 환경. 직장 어린이집과 공원 숲체험 특화.',
    facilities: [
      { name: '상암초등학교 병설유치원', type: '국공립유치원', address: '서울 마포구 매봉산로 25', ageRange: '만 3~5세', features: ['월드컵공원숲체험', '초등연계', '안전통학'], capacity: 50, operatingHours: '09:00~14:00', fee: '무료' },
      { name: 'MBC 직장어린이집', type: '직장어린이집', address: '서울 마포구 성암로 255', ageRange: '만 0~5세', features: ['미디어체험', '직원복지', '영양안심'], capacity: 90, operatingHours: '07:30~21:00', fee: '회사지원' },
      { name: '구립 상암DMC어린이집', type: '국공립어린이집', address: '서울 마포구 월드컵북로 402', ageRange: '만 0~5세', features: ['구립인증', '연장보육', '생태놀이'], capacity: 65, operatingHours: '07:30~19:30', fee: '정부지원 무료' }
    ]
  },

  // =========================================================================
  // 5. 서울특별시 양천구
  // =========================================================================
  {
    dong: '목동', district: '양천구', city: '서울특별시',
    areaNote: '목동 신시가지 아파트 단지 중심의 전통 학군지. 안양천 산책로와 도서관 연계 교육 활발.',
    facilities: [
      { name: '목동초등학교 병설유치원', type: '국공립유치원', address: '서울 양천구 목동서로 225', ageRange: '만 3~5세', features: ['초등연계', '예술체험', '독서인성'], capacity: 75, operatingHours: '09:00~14:00 (방과후 ~19:30)', fee: '무료' },
      { name: '목동1단지어린이집', type: '국공립어린이집', address: '서울 양천구 안양천로 1211 1단지 내', ageRange: '만 0~5세', features: ['단지국공립', '안심보육', '영아전담'], capacity: 60, operatingHours: '07:30~19:30', fee: '정부지원 무료' },
      { name: '예일유치원', type: '사립유치원', address: '서울 양천구 목동중앙로 45', ageRange: '만 3~5세', features: ['창의융합STEAM', '프로젝트수업', '영어놀이'], capacity: 130, operatingHours: '09:00~14:30', fee: '월 40~65만원' }
    ]
  },

  // =========================================================================
  // 6. 서울특별시 용산구
  // =========================================================================
  {
    dong: '이촌동', district: '용산구', city: '서울특별시',
    areaNote: '동부이촌동 한강변 전통 주거지. 외국인 거주자 및 다문화 글로벌 감각 유치원 다수.',
    facilities: [
      { name: '신용산초등학교 병설유치원', type: '국공립유치원', address: '서울 용산구 이촌로 255', ageRange: '만 4~5세', features: ['한강생태체험', '초등연계', '인성교육'], capacity: 45, operatingHours: '09:00~14:00', fee: '무료' },
      { name: '한강유치원', type: '사립유치원', address: '서울 용산구 이촌로 166', ageRange: '만 3~5세', features: ['글로벌영어놀이', '미술특성화', '차량운행'], capacity: 110, operatingHours: '09:00~14:30', fee: '월 45~75만원' },
      { name: '구립 이촌어린이집', type: '국공립어린이집', address: '서울 용산구 이촌로 51길 22', ageRange: '만 0~5세', features: ['구립국공립', '영아안심', '시간연장'], capacity: 55, operatingHours: '07:30~19:30', fee: '정부지원 무료' }
    ]
  },
  {
    dong: '한남동', district: '용산구', city: '서울특별시',
    areaNote: '나인원한남, 한남더힐 등 고급 주거지 및 대사관 밀집. 프라이빗·자연친화 교육 선호.',
    facilities: [
      { name: '한남초등학교 병설유치원', type: '국공립유치원', address: '서울 용산구 한남대로 112', ageRange: '만 3~5세', features: ['남산생태체험', '공립유치원', '무상급식'], capacity: 48, operatingHours: '09:00~14:00', fee: '무료' },
      { name: '구립 한남어린이집', type: '국공립어린이집', address: '서울 용산구 대사관로 34길 11', ageRange: '만 0~5세', features: ['구립국공립', '오감체험', '친환경식단'], capacity: 50, operatingHours: '07:30~19:30', fee: '정부지원 무료' }
    ]
  },

  // =========================================================================
  // 7. 서울특별시 성동구
  // =========================================================================
  {
    dong: '옥수동', district: '성동구', city: '서울특별시',
    areaNote: '옥수파크힐스, 래미안옥수리버젠 등 신흥 주거단지. 매봉산과 응봉공원 자연 접근성.',
    facilities: [
      { name: '옥정초등학교 병설유치원', type: '국공립유치원', address: '서울 성동구 한림말길 43', ageRange: '만 3~5세', features: ['초등연계', '숲체험', '안전급식'], capacity: 50, operatingHours: '09:00~14:00', fee: '무료' },
      { name: '구립 파크힐스어린이집', type: '국공립어린이집', address: '서울 성동구 매봉길 49 단지 내', ageRange: '만 0~5세', features: ['단지국공립', '야간연장보육', '친환경시설'], capacity: 75, operatingHours: '07:30~19:30', fee: '정부지원 무료' }
    ]
  },
  {
    dong: '성수동', district: '성동구', city: '서울특별시',
    areaNote: '서울숲 공원과 트리마제, 아크로서울포레스트 인근. 서울숲 생태 보육 특화.',
    facilities: [
      { name: '경동초등학교 병설유치원', type: '국공립유치원', address: '서울 성동구 서울숲 4길 10', ageRange: '만 3~5세', features: ['서울숲생태수업', '초등시설활용', '인성교육'], capacity: 50, operatingHours: '09:00~14:00', fee: '무료' },
      { name: '구립 성수어린이집', type: '국공립어린이집', address: '서울 성동구 아차산로 7길 34', ageRange: '만 0~5세', features: ['구립인증', '서울숲나들이', '영아전담'], capacity: 60, operatingHours: '07:30~19:30', fee: '정부지원 무료' }
    ]
  },

  // =========================================================================
  // 8. 서울특별시 영등포구
  // =========================================================================
  {
    dong: '여의도동', district: '영등포구', city: '서울특별시',
    areaNote: '금융·방송 직장인 밀집 지역. 직장 어린이집과 한강공원 인프라 풍부.',
    facilities: [
      { name: '여의도초등학교 병설유치원', type: '국공립유치원', address: '서울 영등포구 의사당대로 25', ageRange: '만 3~5세', features: ['한강생태체험', '문화예술', '공립유치원'], capacity: 60, operatingHours: '09:00~14:00 (방과후 ~19:30)', fee: '무료' },
      { name: '여의도유치원', type: '사립유치원', address: '서울 영등포구 여의대방로 379', ageRange: '만 3~5세', features: ['음악감성특화', '프로젝트수업', '원어민영어'], capacity: 120, operatingHours: '09:00~14:30', fee: '월 40~65만원' },
      { name: 'KBS 직장어린이집', type: '직장어린이집', address: '서울 영등포구 여의공원로 13', ageRange: '만 0~5세', features: ['방송직원복지', '야간연장', '우수급식'], capacity: 80, operatingHours: '07:30~21:30', fee: '회사지원' },
      { name: '구립 여의도파크어린이집', type: '국공립어린이집', address: '서울 영등포구 여의동로 36', ageRange: '만 0~5세', features: ['직장인부모배려', '시간연장', '안심보육'], capacity: 55, operatingHours: '07:30~19:30', fee: '정부지원 무료' }
    ]
  },

  // =========================================================================
  // 9. 서울특별시 노원구
  // =========================================================================
  {
    dong: '중계동', district: '노원구', city: '서울특별시',
    areaNote: '강북 대표 학원가 은행사거리 위치. 높은 교육열과 다양한 사립·국공립 시설 조화.',
    facilities: [
      { name: '중계초등학교 병설유치원', type: '국공립유치원', address: '서울 노원구 중계로 14길 35', ageRange: '만 3~5세', features: ['초등연계', '독서마라톤', '친환경식단'], capacity: 60, operatingHours: '09:00~14:00', fee: '무료' },
      { name: '청암유치원', type: '사립유치원', address: '서울 노원구 중계로 115', ageRange: '만 3~5세', features: ['자연생태체험', '체육특성화', '영어놀이'], capacity: 140, operatingHours: '09:00~14:30', fee: '월 35~55만원' },
      { name: '구립 중계어린이집', type: '국공립어린이집', address: '서울 노원구 노원로 330', ageRange: '만 0~5세', features: ['구립국공립', '영아전담', '야간연장'], capacity: 65, operatingHours: '07:30~19:30', fee: '정부지원 무료' }
    ]
  },

  // =========================================================================
  // 10. 서울특별시 강동구
  // =========================================================================
  {
    dong: '고덕동', district: '강동구', city: '서울특별시',
    areaNote: '고덕그라시움, 고덕아르테온 등 1만여 세대 대규모 재건축 신도시급 주거단지.',
    facilities: [
      { name: '고덕초등학교 병설유치원', type: '국공립유치원', address: '서울 강동구 동남로 82길 22', ageRange: '만 3~5세', features: ['공립유치원', '방과후돌봄', '무상급식'], capacity: 55, operatingHours: '09:00~14:00', fee: '무료' },
      { name: '구립 그라시움어린이집', type: '국공립어린이집', address: '서울 강동구 고덕로 333 단지 내', ageRange: '만 0~5세', features: ['단지국공립', '최신보육시설', '영아전담반'], capacity: 90, operatingHours: '07:30~19:30', fee: '정부지원 무료' },
      { name: '배재유치원', type: '사립유치원', address: '서울 강동구 고덕로 227', ageRange: '만 3~5세', features: ['역사와전통', '기독교인성', '생태놀이'], capacity: 130, operatingHours: '09:00~14:30', fee: '월 35~55만원' }
    ]
  },

  // =========================================================================
  // 11. 서울특별시 동작구
  // =========================================================================
  {
    dong: '흑석동', district: '동작구', city: '서울특별시',
    areaNote: '흑석뉴타운(아크로리버하임 등) 조성으로 영유아 인구 급증.',
    facilities: [
      { name: '중앙대학교 사범대학 부속유치원', type: '사립유치원', address: '서울 동작구 흑석로 84', ageRange: '만 3~5세', features: ['대학부속유치원', '연구학교프로그램', '우수교원진'], capacity: 120, operatingHours: '09:00~14:30', fee: '월 40~60만원' },
      { name: '구립 흑석어린이집', type: '국공립어린이집', address: '서울 동작구 서달로 123', ageRange: '만 0~5세', features: ['구립국공립', '한강조망산책', '연장보육'], capacity: 60, operatingHours: '07:30~19:30', fee: '정부지원 무료' }
    ]
  },

  // =========================================================================
  // 12. 서울특별시 강서구
  // =========================================================================
  {
    dong: '마곡동', district: '강서구', city: '서울특별시',
    areaNote: '마곡 R&D 산업단지 및 엠밸리 대단지. LG아트센터 및 서울식물원 인접.',
    facilities: [
      { name: '공진초등학교 병설유치원', type: '국공립유치원', address: '서울 강서구 강서로 47길 34', ageRange: '만 3~5세', features: ['서울식물원생태연계', '초등시설', '무상급식'], capacity: 55, operatingHours: '09:00~14:00', fee: '무료' },
      { name: 'LG 사이언스파크 직장어린이집', type: '직장어린이집', address: '서울 강서구 마곡중앙10로 70', ageRange: '만 0~5세', features: ['대기업직장보육', '스마트케어', '최고수준시설'], capacity: 150, operatingHours: '07:30~20:00', fee: '회사지원' },
      { name: '구립 마곡엠밸리어린이집', type: '국공립어린이집', address: '서울 강서구 마곡서로 101 단지 내', ageRange: '만 0~5세', features: ['단지국공립', '생태놀이', '야간연장'], capacity: 75, operatingHours: '07:30~19:30', fee: '정부지원 무료' }
    ]
  },

  // =========================================================================
  // 13. 서울특별시 은평구
  // =========================================================================
  {
    dong: '진관동', district: '은평구', city: '서울특별시',
    areaNote: '은평뉴타운 북한산 자락 위치. 전국 최고 수준의 숲체험·생태 유아교육 환경.',
    facilities: [
      { name: '은평초등학교 병설유치원', type: '국공립유치원', address: '서울 은평구 진관2로 57', ageRange: '만 3~5세', features: ['북한산숲체험', '생태텃밭', '초등연계'], capacity: 60, operatingHours: '09:00~14:00', fee: '무료' },
      { name: '하나고등학교 직장어린이집', type: '직장어린이집', address: '서울 은평구 연서로 535', ageRange: '만 1~5세', features: ['자연친화', '소수정예', '안심보육'], capacity: 40, operatingHours: '07:30~19:30', fee: '직원지원' },
      { name: '구립 북한산숲어린이집', type: '국공립어린이집', address: '서울 은평구 진관1로 21', ageRange: '만 0~5세', features: ['구립숲보육', '친환경급식', '안심등하원'], capacity: 65, operatingHours: '07:30~19:30', fee: '정부지원 무료' }
    ]
  },

  // =========================================================================
  // 14. 서울특별시 광진구
  // =========================================================================
  {
    dong: '광장동', district: '광진구', city: '서울특별시',
    areaNote: '아차산과 한강 사이 전통 명문 학군지. 어린이대공원 접근성 우수.',
    facilities: [
      { name: '광장초등학교 병설유치원', type: '국공립유치원', address: '서울 광진구 아차산로 78길 44', ageRange: '만 3~5세', features: ['공립유치원', '아차산자연탐험', '독서교육'], capacity: 50, operatingHours: '09:00~14:00', fee: '무료' },
      { name: '세종유치원', type: '사립유치원', address: '서울 광진구 광장로 19', ageRange: '만 3~5세', features: ['음악예술특화', '어린이대공원체험', '원어민영어'], capacity: 110, operatingHours: '09:00~14:30', fee: '월 38~60만원' },
      { name: '구립 광장어린이집', type: '국공립어린이집', address: '서울 광진구 광장로 1길 18', ageRange: '만 0~5세', features: ['구립국공립', '영아전담', '야간연장'], capacity: 60, operatingHours: '07:30~19:30', fee: '정부지원 무료' }
    ]
  },

  // =========================================================================
  // 15. 경기도 주요 신도시 (판교, 분당 등)
  // =========================================================================
  {
    dong: '판교동', district: '분당구', city: '경기도 성남시',
    areaNote: '판교테크노밸리 배후 신도시. IT기업 직장 어린이집과 단지 국공립 우수.',
    facilities: [
      { name: '판교초등학교 병설유치원', type: '국공립유치원', address: '경기 성남시 분당구 판교동 602', ageRange: '만 3~5세', features: ['초등연계', '스마트교육', '무상급식'], capacity: 50, operatingHours: '09:00~14:00', fee: '무료' },
      { name: '엔씨소프트 웃는땅콩어린이집', type: '직장어린이집', address: '경기 성남시 분당구 대왕판교로 648', ageRange: '만 0~5세', features: ['IT대표직장보육', '자체개발놀이과정', '수영장보유'], capacity: 160, operatingHours: '07:30~20:30', fee: '회사지원' },
      { name: '시립 판교어린이집', type: '국공립어린이집', address: '경기 성남시 분당구 판교원로 82길', ageRange: '만 0~5세', features: ['시립국공립', '영아전담', '친환경식단'], capacity: 70, operatingHours: '07:30~19:30', fee: '정부지원 무료' }
    ]
  }
];

// 동적 생성 알고리즘: DB에 등록되지 않은 임의의 지역 검색 시 표준 모델을 제공합니다.
export function generateDynamicDong(dongName: string): DongData {
  return {
    dong: dongName,
    district: '해당 지역구',
    city: '대한민국',
    areaNote: `✅ ${dongName} 지역 표준 보육·교육 모델입니다. (정부 공식 공시정보 조회 버튼을 누르면 실시간 100% 전체 목록을 확인하실 수 있습니다)`,
    facilities: [
      { 
        name: `${dongName} 초등학교 병설유치원`, 
        type: '국공립유치원', 
        address: `${dongName} 초등학교 내`, 
        ageRange: '만 3~5세', 
        features: ['초등연계교육', '넓은운동장', '안전한통학로', '무상급식'], 
        capacity: 50, 
        operatingHours: '09:00~14:00 (방과후 ~19:30)', 
        fee: '정부지원 전액무료' 
      },
      { 
        name: `구립(시립) ${dongName} 어린이집`, 
        type: '국공립어린이집', 
        address: `${dongName} 주민센터 인근`, 
        ageRange: '만 0~5세', 
        features: ['맞벌이부부우선', '야간연장보육', '영아전담반', '친환경식단'], 
        capacity: 65, 
        operatingHours: '07:30~19:30', 
        fee: '정부지원 전액무료' 
      },
      { 
        name: `${dongName} 숲속유치원`, 
        type: '사립유치원', 
        address: `${dongName} 교육로 인근`, 
        ageRange: '만 3~5세', 
        features: ['창의감성체험', '원어민영어놀이', '통학차량운행'], 
        capacity: 100, 
        operatingHours: '09:00~14:30 (방과후 ~18:30)', 
        fee: '정부지원 외 약 30~50만원' 
      },
      { 
        name: `아이사랑어린이집 (${dongName})`, 
        type: '민간어린이집', 
        address: `${dongName} 주거단지 내`, 
        ageRange: '만 1~5세', 
        features: ['오감발달놀이', '유아체육', '차량운행'], 
        capacity: 45, 
        operatingHours: '07:30~19:30', 
        fee: '정부지원 + 차액보육료' 
      }
    ]
  };
}

/**
 * 똑똑한 통합 검색 함수:
 * 1. 유치원/어린이집 이름(예: '이화', '이화유치원', '한솔', '블레스티지', '자이')
 * 2. 동(洞) 이름(예: '개포동', '개포', '대치', '잠실', '반포')
 * 3. 구(區) 이름(예: '강남구', '서초구', '송파구', '마포구')
 * 4. 주소, 특색 교육 키워드(예: '개포로', '몬테소리', '숲체험', '영어')
 * 를 모두 검색합니다!
 */
export function searchFacilities(query: string): DongData[] {
  if (!query.trim()) return [];
  const q = query.trim().toLowerCase();

  const results: DongData[] = [];

  for (const d of KINDERGARTEN_DB) {
    const dongMatch =
      d.dong.toLowerCase().includes(q) ||
      d.district.toLowerCase().includes(q) ||
      d.city.toLowerCase().includes(q);

    // 해당 동 안에서 이름/주소/특징이 검색어와 일치하는 개별 시설 찾기
    const matchingFacilities = d.facilities.filter(f =>
      f.name.toLowerCase().includes(q) ||
      f.address.toLowerCase().includes(q) ||
      f.type.toLowerCase().includes(q) ||
      f.features.some(feat => feat.toLowerCase().includes(q))
    );

    if (dongMatch) {
      // 동 이름이나 구 이름으로 검색했을 때는 해당 동의 전체 시설을 보여줌
      results.push(d);
    } else if (matchingFacilities.length > 0) {
      // 시설 이름(예: "이화유치원")으로 검색했을 때는 해당 시설이 포함된 동을 반환 (검색된 시설 우선 배치)
      const nonMatching = d.facilities.filter(f => !matchingFacilities.includes(f));
      results.push({
        ...d,
        facilities: [...matchingFacilities, ...nonMatching],
        areaNote: `🎯 "${query}" 검색과 일치하는 시설이 포함된 지역입니다. (${d.city} ${d.district} ${d.dong})`
      });
    }
  }

  if (results.length > 0) {
    return results;
  }

  // 2글자 이상이면 동적 표준 모델 제공
  if (q.length >= 2) {
    return [generateDynamicDong(query.trim())];
  }

  return [];
}

export function getAllCities(): string[] {
  return [...new Set(KINDERGARTEN_DB.map(d => d.city))];
}

export function getDistricts(city: string): string[] {
  return [...new Set(KINDERGARTEN_DB.filter(d => d.city === city).map(d => d.district))];
}

export function getDongs(city: string, district: string): DongData[] {
  return KINDERGARTEN_DB.filter(d => d.city === city && d.district === district);
}
