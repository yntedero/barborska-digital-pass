import type { AnalyticsData } from '~~/shared/types'

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
    { label: 'QR skeny celkom', value: 12847, change: 12.3, icon: 'i-lucide-scan-line' },
    { label: 'Overené check-iny', value: 4231, change: 8.7, icon: 'i-lucide-circle-check-big' },
    { label: 'Unikátni návštevníci', value: 1893, change: 15.2, icon: 'i-lucide-users' },
    { label: 'Priemer zastávok', value: '4.2', change: -2.1, icon: 'i-lucide-map-pin' },
    { label: 'Dokončenie trasy', value: '3.8%', change: 1.4, icon: 'i-lucide-trophy' },
    { label: 'Top dnes', value: 'Kremnica', change: 0, icon: 'i-lucide-flame' },
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
    { name: 'Slovensko', value: 45 },
    { name: 'Česko', value: 25 },
    { name: 'Nemecko', value: 12 },
    { name: 'Poľsko', value: 8 },
    { name: 'Rakúsko', value: 5 },
    { name: 'Ostatné', value: 5 },
  ],

  travelModes: [
    { name: 'Pešo', value: 72 },
    { name: 'Bicykel', value: 24 },
    { name: 'Ostatné', value: 4 },
  ],

  activityFeed: [
    { id: 1, type: 'checkin', message: 'Nový check-in: Kremnica', time: 'pred 2 min', stopId: 13 },
    { id: 2, type: 'visitor', message: 'Nový návštevník z Česka', time: 'pred 5 min' },
    {
      id: 3,
      type: 'checkin',
      message: 'GPS overený: Banská Štiavnica',
      time: 'pred 8 min',
      stopId: 18,
    },
    {
      id: 4,
      type: 'popular',
      message: 'Špania Dolina — 15 návštev dnes',
      time: 'pred 12 min',
      stopId: 3,
    },
    { id: 5, type: 'checkin', message: 'Check-in: Staré Hory', time: 'pred 18 min', stopId: 5 },
    { id: 6, type: 'visitor', message: 'Nový návštevník z Nemecka', time: 'pred 22 min' },
    { id: 7, type: 'checkin', message: 'GPS overený: Zvolen', time: 'pred 30 min', stopId: 24 },
    {
      id: 8,
      type: 'popular',
      message: 'Kremnica — 28 návštev dnes',
      time: 'pred 35 min',
      stopId: 13,
    },
    { id: 9, type: 'checkin', message: 'Check-in: Sliač', time: 'pred 42 min', stopId: 26 },
    { id: 10, type: 'visitor', message: 'Nový návštevník zo Slovenska', time: 'pred 48 min' },
    {
      id: 11,
      type: 'checkin',
      message: 'GPS overený: Banská Bystrica',
      time: 'pred 55 min',
      stopId: 1,
    },
    {
      id: 12,
      type: 'popular',
      message: 'Banská Bystrica — 34 návštev dnes',
      time: 'pred 1 hod',
      stopId: 1,
    },
    { id: 13, type: 'checkin', message: 'Check-in: Hronsek', time: 'pred 1 hod', stopId: 28 },
    { id: 14, type: 'visitor', message: 'Nový návštevník z Poľska', time: 'pred 1 hod' },
    { id: 15, type: 'checkin', message: 'GPS overený: Ostrá Lúka', time: 'pred 2 hod', stopId: 23 },
    { id: 16, type: 'checkin', message: 'Check-in: Krahule', time: 'pred 2 hod', stopId: 11 },
    { id: 17, type: 'visitor', message: 'Nový návštevník z Rakúska', time: 'pred 2 hod' },
    {
      id: 18,
      type: 'checkin',
      message: 'GPS overený: Sklené Teplice',
      time: 'pred 3 hod',
      stopId: 16,
    },
    {
      id: 19,
      type: 'popular',
      message: 'Zvolen — 19 návštev dnes',
      time: 'pred 3 hod',
      stopId: 24,
    },
    { id: 20, type: 'checkin', message: 'Check-in: Svätý Anton', time: 'pred 3 hod', stopId: 20 },
    { id: 21, type: 'visitor', message: 'Nový návštevník z Maďarska', time: 'pred 3 hod' },
    { id: 22, type: 'checkin', message: 'GPS overený: Harmanec', time: 'pred 4 hod', stopId: 6 },
    { id: 23, type: 'checkin', message: 'Check-in: Kordíky', time: 'pred 4 hod', stopId: 8 },
    {
      id: 24,
      type: 'popular',
      message: 'Staré Hory — 12 návštev dnes',
      time: 'pred 4 hod',
      stopId: 5,
    },
    { id: 25, type: 'visitor', message: 'Nový návštevník zo Slovenska', time: 'pred 4 hod' },
    { id: 26, type: 'checkin', message: 'GPS overený: Vartovka', time: 'pred 5 hod', stopId: 29 },
    { id: 27, type: 'checkin', message: 'Check-in: Görgeyho tunel', time: 'pred 5 hod', stopId: 9 },
    { id: 28, type: 'visitor', message: 'Nový návštevník z Česka', time: 'pred 5 hod' },
    { id: 29, type: 'checkin', message: 'GPS overený: Repište', time: 'pred 6 hod', stopId: 17 },
    {
      id: 30,
      type: 'popular',
      message: 'Banská Štiavnica — 22 návštev dnes',
      time: 'pred 6 hod',
      stopId: 18,
    },
    { id: 31, type: 'checkin', message: 'Check-in: Pustý Hrad', time: 'pred 6 hod', stopId: 25 },
    { id: 32, type: 'visitor', message: 'Nový návštevník z Nemecka', time: 'pred 7 hod' },
    { id: 33, type: 'checkin', message: 'GPS overený: Piesky', time: 'pred 7 hod', stopId: 4 },
    { id: 34, type: 'checkin', message: 'Check-in: Bacúrov', time: 'pred 7 hod', stopId: 22 },
    { id: 35, type: 'visitor', message: 'Nový návštevník zo Slovenska', time: 'pred 8 hod' },
    { id: 36, type: 'popular', message: 'Sliač — 8 návštev dnes', time: 'pred 8 hod', stopId: 26 },
    {
      id: 37,
      type: 'checkin',
      message: 'GPS overený: Kláštor Sampor',
      time: 'pred 8 hod',
      stopId: 27,
    },
    { id: 38, type: 'checkin', message: 'Check-in: Horná Ves', time: 'pred 9 hod', stopId: 14 },
    { id: 39, type: 'visitor', message: 'Nový návštevník z Poľska', time: 'pred 9 hod' },
    { id: 40, type: 'checkin', message: 'GPS overený: Jakub', time: 'pred 9 hod', stopId: 2 },
    {
      id: 41,
      type: 'popular',
      message: 'Kremnica — 31 návštev včera',
      time: 'pred 10 hod',
      stopId: 13,
    },
    {
      id: 42,
      type: 'checkin',
      message: 'Check-in: Kremnické Bane',
      time: 'pred 10 hod',
      stopId: 12,
    },
    { id: 43, type: 'visitor', message: 'Nový návštevník z Česka', time: 'pred 10 hod' },
    { id: 44, type: 'checkin', message: 'GPS overený: Skalka', time: 'pred 11 hod', stopId: 10 },
    {
      id: 45,
      type: 'checkin',
      message: 'Check-in: Šášovské Podhradie',
      time: 'pred 11 hod',
      stopId: 15,
    },
    { id: 46, type: 'visitor', message: 'Nový návštevník zo Slovenska', time: 'pred 12 hod' },
    {
      id: 47,
      type: 'popular',
      message: 'Ostrá Lúka — 6 návštev včera',
      time: 'pred 12 hod',
      stopId: 23,
    },
    {
      id: 48,
      type: 'checkin',
      message: 'GPS overený: Banský Studenec',
      time: 'pred 13 hod',
      stopId: 21,
    },
    {
      id: 49,
      type: 'checkin',
      message: 'Check-in: Banskoštiavnická kalvária',
      time: 'pred 14 hod',
      stopId: 19,
    },
    { id: 50, type: 'visitor', message: 'Nový návštevník z Rakúska', time: 'pred 14 hod' },
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
