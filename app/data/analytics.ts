import { stops } from '~/data/stops'
import type { AnalyticsData } from '~~/shared/types'

export interface StopStats {
  id: number
  name: string
  stage: number
  views: number
  checkins: number
  verified: number
}

/** Deterministic mock stats for each stop, seeded by stop id */
export const stopStats: StopStats[] = stops.map((stop) => {
  const seed = stop.id
  const views = Math.max(120, Math.round(2400 - ((seed * 67) % 1800) + Math.sin(seed) * 200))
  const checkins = Math.max(30, Math.round(views * (0.25 + (seed % 10) / 40)))
  const verified = Math.max(15, Math.round(checkins * (0.6 + (seed % 7) / 20)))
  return {
    id: stop.id,
    name: stop.name,
    stage: stop.stage,
    views,
    checkins,
    verified,
  }
})

function generateDailyVisits(days: number): { date: string; visits: number }[] {
  const result = []
  const now = new Date()
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const base = 40 + Math.floor(Math.sin(i * 0.3) * 20 + Math.random() * 25)
    result.push({
      date: d.toISOString().split('T')[0],
      visits: Math.max(10, base),
    })
  }
  return result
}

export const analyticsData: AnalyticsData = {
  kpis: [
    { labelKey: 'admin.kpi.qrScans', value: 12847, change: 12.3, icon: 'i-lucide-scan-line' },
    { labelKey: 'admin.kpi.checkins', value: 4231, change: 8.7, icon: 'i-lucide-circle-check-big' },
    { labelKey: 'admin.kpi.unique', value: 1893, change: 15.2, icon: 'i-lucide-users' },
    { labelKey: 'admin.kpi.avgStops', value: '4.2', change: -2.1, icon: 'i-lucide-map-pin' },
    { labelKey: 'admin.kpi.completion', value: '3.8%', change: 1.4, icon: 'i-lucide-trophy' },
    { labelKey: 'admin.kpi.topToday', value: 'Kremnica', change: 0, icon: 'i-lucide-flame' },
  ],

  dailyVisits: generateDailyVisits(90),

  stageCheckins: [1240, 980, 870, 650, 720, 480, 560, 390, 310],

  topStops: [
    { name: 'Banská Bystrica', views: 2340 },
    { name: 'Kremnica', views: 1890 },
    { name: 'Banská Štiavnica', views: 1720 },
    { name: 'Zvolen', views: 1450 },
    { name: 'Špania Dolina', views: 1200 },
    { name: 'Sklené Teplice', views: 980 },
    { name: 'Staré Hory', views: 870 },
    { name: 'Sliač', views: 760 },
    { name: 'Ostrá Lúka', views: 650 },
    { name: 'Vartovka', views: 580 },
  ],

  countries: [
    { nameKey: 'analyticsData.countries.slovakia', value: 45 },
    { nameKey: 'analyticsData.countries.czechia', value: 25 },
    { nameKey: 'analyticsData.countries.germany', value: 12 },
    { nameKey: 'analyticsData.countries.poland', value: 8 },
    { nameKey: 'analyticsData.countries.austria', value: 5 },
    { nameKey: 'analyticsData.countries.other', value: 5 },
  ],

  travelModes: [
    { nameKey: 'analyticsData.travelModes.walking', value: 72 },
    { nameKey: 'analyticsData.travelModes.cycling', value: 24 },
    { nameKey: 'analyticsData.travelModes.other', value: 4 },
  ],

  activityFeed: [
    { id: 1, type: 'checkin', subtype: 'new', stopName: 'Kremnica', timeMinutes: 2, stopId: 13 },
    { id: 2, type: 'visitor', countryKey: 'analyticsData.countries.czechia', timeMinutes: 5 },
    {
      id: 3,
      type: 'checkin',
      subtype: 'gps',
      stopName: 'Banská Štiavnica',
      timeMinutes: 8,
      stopId: 18,
    },
    {
      id: 4,
      type: 'popular',
      stopName: 'Špania Dolina',
      count: 15,
      period: 'today',
      timeMinutes: 12,
      stopId: 3,
    },
    {
      id: 5,
      type: 'checkin',
      subtype: 'standard',
      stopName: 'Staré Hory',
      timeMinutes: 18,
      stopId: 5,
    },
    { id: 6, type: 'visitor', countryKey: 'analyticsData.countries.germany', timeMinutes: 22 },
    { id: 7, type: 'checkin', subtype: 'gps', stopName: 'Zvolen', timeMinutes: 30, stopId: 24 },
    {
      id: 8,
      type: 'popular',
      stopName: 'Kremnica',
      count: 28,
      period: 'today',
      timeMinutes: 35,
      stopId: 13,
    },
    { id: 9, type: 'checkin', subtype: 'standard', stopName: 'Sliač', timeMinutes: 42, stopId: 26 },
    { id: 10, type: 'visitor', countryKey: 'analyticsData.countries.slovakia', timeMinutes: 48 },
    {
      id: 11,
      type: 'checkin',
      subtype: 'gps',
      stopName: 'Banská Bystrica',
      timeMinutes: 55,
      stopId: 1,
    },
    {
      id: 12,
      type: 'popular',
      stopName: 'Banská Bystrica',
      count: 34,
      period: 'today',
      timeMinutes: 60,
      stopId: 1,
    },
    {
      id: 13,
      type: 'checkin',
      subtype: 'standard',
      stopName: 'Hronsek',
      timeMinutes: 65,
      stopId: 28,
    },
    { id: 14, type: 'visitor', countryKey: 'analyticsData.countries.poland', timeMinutes: 70 },
    {
      id: 15,
      type: 'checkin',
      subtype: 'gps',
      stopName: 'Ostrá Lúka',
      timeMinutes: 120,
      stopId: 23,
    },
    {
      id: 16,
      type: 'checkin',
      subtype: 'standard',
      stopName: 'Krahule',
      timeMinutes: 120,
      stopId: 11,
    },
    { id: 17, type: 'visitor', countryKey: 'analyticsData.countries.austria', timeMinutes: 130 },
    {
      id: 18,
      type: 'checkin',
      subtype: 'gps',
      stopName: 'Sklené Teplice',
      timeMinutes: 180,
      stopId: 16,
    },
    {
      id: 19,
      type: 'popular',
      stopName: 'Zvolen',
      count: 19,
      period: 'today',
      timeMinutes: 180,
      stopId: 24,
    },
    {
      id: 20,
      type: 'checkin',
      subtype: 'standard',
      stopName: 'Svätý Anton',
      timeMinutes: 180,
      stopId: 20,
    },
    { id: 21, type: 'visitor', countryKey: 'analyticsData.countries.other', timeMinutes: 195 },
    { id: 22, type: 'checkin', subtype: 'gps', stopName: 'Harmanec', timeMinutes: 240, stopId: 6 },
    {
      id: 23,
      type: 'checkin',
      subtype: 'standard',
      stopName: 'Kordíky',
      timeMinutes: 240,
      stopId: 8,
    },
    {
      id: 24,
      type: 'popular',
      stopName: 'Staré Hory',
      count: 12,
      period: 'today',
      timeMinutes: 240,
      stopId: 5,
    },
    { id: 25, type: 'visitor', countryKey: 'analyticsData.countries.slovakia', timeMinutes: 250 },
    { id: 26, type: 'checkin', subtype: 'gps', stopName: 'Vartovka', timeMinutes: 300, stopId: 29 },
    {
      id: 27,
      type: 'checkin',
      subtype: 'standard',
      stopName: 'Görgeyho tunel',
      timeMinutes: 300,
      stopId: 9,
    },
    { id: 28, type: 'visitor', countryKey: 'analyticsData.countries.czechia', timeMinutes: 310 },
    { id: 29, type: 'checkin', subtype: 'gps', stopName: 'Repište', timeMinutes: 360, stopId: 17 },
    {
      id: 30,
      type: 'popular',
      stopName: 'Banská Štiavnica',
      count: 22,
      period: 'today',
      timeMinutes: 360,
      stopId: 18,
    },
    {
      id: 31,
      type: 'checkin',
      subtype: 'standard',
      stopName: 'Pustý Hrad',
      timeMinutes: 360,
      stopId: 25,
    },
    { id: 32, type: 'visitor', countryKey: 'analyticsData.countries.germany', timeMinutes: 420 },
    { id: 33, type: 'checkin', subtype: 'gps', stopName: 'Piesky', timeMinutes: 420, stopId: 4 },
    {
      id: 34,
      type: 'checkin',
      subtype: 'standard',
      stopName: 'Bacúrov',
      timeMinutes: 420,
      stopId: 22,
    },
    { id: 35, type: 'visitor', countryKey: 'analyticsData.countries.slovakia', timeMinutes: 480 },
    {
      id: 36,
      type: 'popular',
      stopName: 'Sliač',
      count: 8,
      period: 'today',
      timeMinutes: 480,
      stopId: 26,
    },
    {
      id: 37,
      type: 'checkin',
      subtype: 'gps',
      stopName: 'Kláštor Sampor',
      timeMinutes: 480,
      stopId: 27,
    },
    {
      id: 38,
      type: 'checkin',
      subtype: 'standard',
      stopName: 'Horná Ves',
      timeMinutes: 540,
      stopId: 14,
    },
    { id: 39, type: 'visitor', countryKey: 'analyticsData.countries.poland', timeMinutes: 540 },
    { id: 40, type: 'checkin', subtype: 'gps', stopName: 'Jakub', timeMinutes: 540, stopId: 2 },
    {
      id: 41,
      type: 'popular',
      stopName: 'Kremnica',
      count: 31,
      period: 'yesterday',
      timeMinutes: 600,
      stopId: 13,
    },
    {
      id: 42,
      type: 'checkin',
      subtype: 'standard',
      stopName: 'Kremnické Bane',
      timeMinutes: 600,
      stopId: 12,
    },
    { id: 43, type: 'visitor', countryKey: 'analyticsData.countries.czechia', timeMinutes: 610 },
    { id: 44, type: 'checkin', subtype: 'gps', stopName: 'Skalka', timeMinutes: 660, stopId: 10 },
    {
      id: 45,
      type: 'checkin',
      subtype: 'standard',
      stopName: 'Šášovské Podhradie',
      timeMinutes: 660,
      stopId: 15,
    },
    { id: 46, type: 'visitor', countryKey: 'analyticsData.countries.slovakia', timeMinutes: 720 },
    {
      id: 47,
      type: 'popular',
      stopName: 'Ostrá Lúka',
      count: 6,
      period: 'yesterday',
      timeMinutes: 720,
      stopId: 23,
    },
    {
      id: 48,
      type: 'checkin',
      subtype: 'gps',
      stopName: 'Banský Studenec',
      timeMinutes: 780,
      stopId: 21,
    },
    {
      id: 49,
      type: 'checkin',
      subtype: 'standard',
      stopName: 'Banskoštiavnická kalvária',
      timeMinutes: 840,
      stopId: 19,
    },
    { id: 50, type: 'visitor', countryKey: 'analyticsData.countries.austria', timeMinutes: 840 },
  ],

  stageFunnel: [
    { stage: 1, visitors: 1240 },
    { stage: 2, visitors: 980 },
    { stage: 3, visitors: 870 },
    { stage: 4, visitors: 650 },
    { stage: 5, visitors: 720 },
    { stage: 6, visitors: 480 },
    { stage: 7, visitors: 560 },
    { stage: 8, visitors: 390 },
    { stage: 9, visitors: 310 },
  ],
}
