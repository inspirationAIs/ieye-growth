import type { AssessmentResult, DomainKey, DomainScore, DevelopmentLevel, KDSTPeriod, QuestionResponse } from '@/types';
import { LEVEL_INFO } from '@/data/kdst';

/**
 * Calculates domain-level scores and overall assessment result.
 */
export function scoreAssessment(
  responses: QuestionResponse[],
  period: KDSTPeriod,
  childId: string,
  ageMonths: number
): AssessmentResult {
  const domainScores: DomainScore[] = [];

  const domainKeys: DomainKey[] = ['grossMotor', 'fineMotor', 'cognition', 'language', 'socialEmotional', 'selfHelp'];

  for (const domain of domainKeys) {
    const domainQuestions = period.questions.filter((q) => q.domain === domain);
    const domainResponses = responses.filter((r) =>
      domainQuestions.some((q) => q.id === r.questionId)
    );

    const score = domainResponses.reduce((sum, r) => sum + r.score, 0);
    const maxScore = period.domainMaxScores[domain];
    const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
    const cutoff = period.cutoffs[domain];
    const level = getDomainLevel(score, maxScore, cutoff);

    domainScores.push({ domain, score, maxScore, percentage, level });
  }

  const overallScore = domainScores.reduce((sum, d) => sum + d.score, 0);
  const overallMaxScore = domainScores.reduce((sum, d) => sum + d.maxScore, 0);
  const overallLevel = getOverallLevel(domainScores);

  return {
    id: `assessment_${Date.now()}`,
    childId,
    assessmentDate: new Date().toISOString(),
    ageMonths,
    kdstPeriod: period.period,
    domainScores,
    overallScore,
    overallMaxScore,
    overallLevel,
    questionResponses: responses,
  };
}

function getDomainLevel(score: number, maxScore: number, cutoff: number): DevelopmentLevel {
  const percentage = maxScore > 0 ? score / maxScore : 0;
  const cutoffPercent = maxScore > 0 ? cutoff / maxScore : 0;

  if (percentage >= 0.85) return 'advanced';
  if (score >= cutoff) return 'normal';
  if (percentage >= cutoffPercent * 0.6) return 'monitor';
  return 'evaluate';
}

function getOverallLevel(domainScores: DomainScore[]): DevelopmentLevel {
  const evaluateCount = domainScores.filter((d) => d.level === 'evaluate').length;
  const monitorCount = domainScores.filter((d) => d.level === 'monitor').length;
  const advancedCount = domainScores.filter((d) => d.level === 'advanced').length;

  if (evaluateCount >= 2) return 'evaluate';
  if (evaluateCount >= 1 || monitorCount >= 3) return 'monitor';
  if (advancedCount >= 4) return 'advanced';
  return 'normal';
}

export function getLevelInfo(level: DevelopmentLevel) {
  return LEVEL_INFO[level];
}
