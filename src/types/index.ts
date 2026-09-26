// Child profile
export interface ChildProfile {
  id: string;
  name: string;
  birthdate: string; // 'YYYY-MM-DD'
  gender: 'female' | 'male';
  parentEmail: string;
  createdAt: string;
}

// KDST Domain types
export type DomainKey = 'grossMotor' | 'fineMotor' | 'cognition' | 'language' | 'socialEmotional' | 'selfHelp';

export interface DomainLabel {
  key: DomainKey;
  label: string;
  labelEn: string;
  color: string;
  emoji: string;
  description: string;
}

// KDST Question
export interface KDSTQuestion {
  id: string;
  domain: DomainKey;
  text: string;
  tip?: string;
}

// KDST Period (검진 차수)
export interface KDSTPeriod {
  period: number; // 1-10
  label: string; // '8차 (30~35개월)'
  ageRange: [number, number]; // [30, 35] months
  questions: KDSTQuestion[];
  cutoffs: Record<DomainKey, number>; // minimum passing score per domain
  domainMaxScores: Record<DomainKey, number>;
}

// Assessment score per domain
export interface DomainScore {
  domain: DomainKey;
  score: number;
  maxScore: number;
  percentage: number;
  level: DevelopmentLevel;
}

export type DevelopmentLevel = 'advanced' | 'normal' | 'monitor' | 'evaluate';

export interface LevelInfo {
  level: DevelopmentLevel;
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  emoji: string;
  description: string;
  action: string;
}

// Full assessment result
export interface AssessmentResult {
  id: string;
  childId: string;
  assessmentDate: string; // ISO string
  ageMonths: number;
  kdstPeriod: number;
  height?: number;
  weight?: number;
  heightPercentile?: number;
  weightPercentile?: number;
  domainScores: DomainScore[];
  overallScore: number;
  overallMaxScore: number;
  overallLevel: DevelopmentLevel;
  questionResponses: QuestionResponse[];
  notes?: string;
}

export interface QuestionResponse {
  questionId: string;
  score: number; // 0-3
}

// For Google Sheets row formats
export interface SheetAssessmentRow {
  date: string;
  ageMonths: number;
  period: number;
  grossMotor: number;
  fineMotor: number;
  cognition: number;
  language: number;
  socialEmotional: number;
  selfHelp: number;
  totalScore: number;
  overallLevel: string;
  notes: string;
}

export interface MilestoneInfo {
  period: number;
  ageRange: [number, number];
  label: string;
  domains: {
    domain: DomainKey;
    milestones: string[];
    psychologicalNote: string;
  }[];
  parentingTips: string[];
}
