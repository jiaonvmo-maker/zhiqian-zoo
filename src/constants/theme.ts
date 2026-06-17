/**
 * Theme constants for consistent styling across the application
 */

export const DEPARTMENT_COLORS = {
  management: '#c9a227',
  legal: '#8e8e93',
  finance: '#00c7be',
  design: '#ff2d55',
  product: '#34c759',
  commercial: '#af52de',
  tech: '#007aff',
  data: '#ff6b35',
  operation: '#ff9500',
  hr: '#5856d6',
  support: '#64d2ff',
} as const;

export const SCENE_COLORS = {
  building: {
    bg: '#f7ebdd',
    wall: '#ebe4d8',
    base: '#efe2d4',
  },
  workstation: {
    bg: '#e8e4df',
    carpet: '#9a9a9a',
    carpetLight: '#a8a8a8',
    wood: '#c9b8a5',
    woodDark: '#a89078',
  },
} as const;

export const UI_COLORS = {
  text: {
    primary: '#333',
    secondary: '#888',
    tertiary: '#666',
  },
  border: {
    light: 'var(--pa-brown-light)',
  },
} as const;

export const OFFICE_DIMENSIONS = {
  towerWidth: 4.35,
  towerDepth: 3.05,
  floorHeight: 0.36,
  floorGap: 0.055,
  wallHeight: 2,
  wallThickness: 0.2,
  width: 24,
  depth: 16,
} as const;

export type DepartmentId = keyof typeof DEPARTMENT_COLORS;
