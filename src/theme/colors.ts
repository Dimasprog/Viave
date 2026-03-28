/**
 * Global dark palette — app stays dark regardless of system appearance.
 */
export const colors = {
  background: '#07080c',
  surface: '#12161d',
  surfaceElevated: '#181e28',
  text: '#f0f4f8',
  textMuted: '#94a3b8',
  accent: '#6366f1',
  accentPressed: '#4f46e5',
  accentMuted: 'rgba(99, 102, 241, 0.22)',
  border: '#2a3140',
  success: '#22c55e',
  successPressed: '#16a34a',
  danger: '#ef4444',
  dangerPressed: '#dc2626',
  warning: '#f97316',
  chipSelected: '#1e1b4b',
} as const;

export type ColorName = keyof typeof colors;
