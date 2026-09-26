export const GROWTH_DATA = {
  female: [
    { month: 0, hM: 49.1, hS: 1.8, wM: 3.2, wS: 0.4 },
    { month: 6, hM: 65.7, hS: 2.2, wM: 7.3, wS: 0.8 },
    { month: 12, hM: 74.0, hS: 2.5, wM: 8.9, wS: 1.0 },
    { month: 24, hM: 85.7, hS: 3.0, wM: 11.5, wS: 1.2 },
    { month: 36, hM: 95.1, hS: 3.5, wM: 13.9, wS: 1.5 },
    { month: 48, hM: 102.7, hS: 4.0, wM: 16.1, wS: 1.8 },
    { month: 60, hM: 109.4, hS: 4.5, wM: 18.2, wS: 2.1 },
    { month: 72, hM: 115.1, hS: 5.0, wM: 20.2, wS: 2.5 },
  ],
  male: [
    { month: 0, hM: 49.9, hS: 1.9, wM: 3.3, wS: 0.4 },
    { month: 6, hM: 67.6, hS: 2.2, wM: 7.9, wS: 0.8 },
    { month: 12, hM: 75.7, hS: 2.6, wM: 9.6, wS: 1.0 },
    { month: 24, hM: 87.1, hS: 3.1, wM: 12.2, wS: 1.3 },
    { month: 36, hM: 96.1, hS: 3.6, wM: 14.3, wS: 1.5 },
    { month: 48, hM: 103.3, hS: 4.1, wM: 16.3, wS: 1.8 },
    { month: 60, hM: 110.0, hS: 4.6, wM: 18.3, wS: 2.1 },
    { month: 72, hM: 116.0, hS: 5.1, wM: 20.5, wS: 2.5 },
  ]
};

function standardNormalCDF(x: number) {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989423 * Math.exp(-x * x / 2);
  const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return x > 0 ? 1 - p : p;
}

function interpolate(ageMonths: number, data: typeof GROWTH_DATA.female) {
  if (ageMonths <= 0) return data[0];
  if (ageMonths >= 72) return data[data.length - 1];
  
  for (let i = 0; i < data.length - 1; i++) {
    if (ageMonths >= data[i].month && ageMonths < data[i + 1].month) {
      const p1 = data[i];
      const p2 = data[i + 1];
      const ratio = (ageMonths - p1.month) / (p2.month - p1.month);
      return {
        hM: p1.hM + (p2.hM - p1.hM) * ratio,
        hS: p1.hS + (p2.hS - p1.hS) * ratio,
        wM: p1.wM + (p2.wM - p1.wM) * ratio,
        wS: p1.wS + (p2.wS - p1.wS) * ratio,
      };
    }
  }
  return data[data.length - 1];
}

export function calculateGrowthPercentiles(ageMonths: number, gender: 'male' | 'female', height: number, weight: number) {
  const data = gender === 'male' ? GROWTH_DATA.male : GROWTH_DATA.female;
  const stats = interpolate(ageMonths, data);
  
  const zHeight = (height - stats.hM) / stats.hS;
  const zWeight = (weight - stats.wM) / stats.wS;
  
  // Percentile bounded between 1 and 99 for user-friendly display
  let heightPercentile = Math.round(standardNormalCDF(zHeight) * 100);
  let weightPercentile = Math.round(standardNormalCDF(zWeight) * 100);
  
  heightPercentile = Math.max(1, Math.min(99, heightPercentile));
  weightPercentile = Math.max(1, Math.min(99, weightPercentile));
  
  return { heightPercentile, weightPercentile };
}
