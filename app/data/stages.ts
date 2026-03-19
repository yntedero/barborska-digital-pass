import type { Stage } from '~~/shared/types'

export const stages: Stage[] = [
  { id: 1, from: 'Banská Bystrica', to: 'Staré Hory', distance: 24.5 },
  { id: 2, from: 'Staré Hory', to: 'Skalka', distance: 30.5 },
  { id: 3, from: 'Skalka', to: 'Kremnica', distance: 20 },
  { id: 4, from: 'Kremnica', to: 'Sklené Teplice', distance: 30 },
  { id: 5, from: 'Sklené Teplice', to: 'Banská Štiavnica', distance: 12.8 },
  { id: 6, from: 'Banská Štiavnica', to: 'Ostrá Lúka', distance: 26.7 },
  { id: 7, from: 'Ostrá Lúka', to: 'Zvolen', distance: 15 },
  { id: 8, from: 'Zvolen', to: 'Vlkanová', distance: 23.5 },
  { id: 9, from: 'Vlkanová', to: 'Banská Bystrica', distance: 13.3 },
]

export const TOTAL_DISTANCE = 193
export const TOTAL_STOPS = 29
export const STAMPS_FOR_CERTIFICATE = 18
