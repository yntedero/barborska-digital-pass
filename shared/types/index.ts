export type FacilityType =
  | 'wc'
  | 'water'
  | 'food'
  | 'bed'
  | 'bike'
  | 'parking'
  | 'medical'
  | 'shelter'
  | 'ebike'
  | 'laundry'
  | 'shoe'

export type ServiceCategory = 'bed' | 'food' | 'water' | 'bike' | 'shelter' | 'medical'

export type StampState = null | 'viewed' | 'partial' | 'validated'

export interface Stop {
  id: number
  name: string
  stage: number
  lat: number
  lng: number
  desc: string
  facilities: FacilityType[]
}

export interface Stage {
  id: number
  from: string
  to: string
  distance: number
}

export interface Service {
  id: number
  name: string
  category: ServiceCategory
  stopName: string
  stopId: number
  lat: number
  lng: number
  distance: string
  pilgrimFriendly: boolean
  phone: string
  hours: string
  desc: string
}

export interface PassportEntry {
  state: StampState
  timestamp: string | null
}

export interface KpiData {
  labelKey: string
  value: number | string
  change: number
  icon: string
}

export interface ActivityEvent {
  id: number
  type: 'checkin' | 'visitor' | 'popular'
  subtype?: string
  stopName?: string
  countryKey?: string
  count?: number
  period?: string
  timeMinutes: number
  stopId?: number
}

export interface AnalyticsData {
  kpis: KpiData[]
  dailyVisits: { date: string; visits: number }[]
  stageCheckins: number[]
  topStops: { name: string; views: number }[]
  countries: { nameKey: string; value: number }[]
  travelModes: { nameKey: string; value: number }[]
  activityFeed: ActivityEvent[]
  stageFunnel: { stage: number; visitors: number }[]
}
