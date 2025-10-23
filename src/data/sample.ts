export const SAMPLE = {
  productName: 'JUST Perfect — Chardonnay | 2023',
  keyElements: [
    { symbol: 'Ca', label: 'Calcium', value: 3, unit: 'mg/L', state: 'Normal' },
    { symbol: 'Mg', label: 'Magnésium', value: 65, unit: 'mg/L', state: 'Slightly high' },
    { symbol: 'K', label: 'Potassium', value: 826, unit: 'mg/L', state: 'High' },
    { symbol: 'Na', label: 'Sodium', value: 38, unit: 'mg/L', state: 'Normal' },
  ],
} as const;

export type SampleKeyElement = (typeof SAMPLE.keyElements)[number];
