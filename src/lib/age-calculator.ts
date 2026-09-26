/**
 * Calculates the age in completed months from birthdate to today (or a given date).
 */
export function calculateAgeMonths(birthdate: string, referenceDate?: Date): number {
  const birth = new Date(birthdate);
  const ref = referenceDate ?? new Date();

  let months = (ref.getFullYear() - birth.getFullYear()) * 12 +
    (ref.getMonth() - birth.getMonth());

  // Adjust if reference day is before birth day
  if (ref.getDate() < birth.getDate()) {
    months -= 1;
  }

  return Math.max(0, months);
}

export function calculateAgeDays(birthdate: string, referenceDate?: Date): number {
  const birth = new Date(birthdate);
  const ref = referenceDate ?? new Date();
  const diffMs = ref.getTime() - birth.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

export function formatAge(ageMonths: number): string {
  if (ageMonths < 1) return '신생아';
  if (ageMonths < 12) return `생후 ${ageMonths}개월`;
  const years = Math.floor(ageMonths / 12);
  const months = ageMonths % 12;
  if (months === 0) return `만 ${years}세`;
  return `만 ${years}세 ${months}개월`;
}

export function formatAgeDetailed(birthdate: string): {
  ageMonths: number;
  ageDays: number;
  years: number;
  months: number;
  label: string;
  labelShort: string;
} {
  const ageMonths = calculateAgeMonths(birthdate);
  const ageDays = calculateAgeDays(birthdate);
  const years = Math.floor(ageMonths / 12);
  const months = ageMonths % 12;
  const label = formatAge(ageMonths);
  const labelShort = `생후 ${ageMonths}개월`;
  return { ageMonths, ageDays, years, months, label, labelShort };
}

export function getNextCheckupDate(birthdate: string, nextAgeMonths: number): Date {
  const birth = new Date(birthdate);
  const result = new Date(birth);
  result.setMonth(result.getMonth() + nextAgeMonths);
  return result;
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
