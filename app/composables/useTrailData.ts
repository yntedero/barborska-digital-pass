import { stops } from '~/data/stops'
import { stages } from '~/data/stages'
import { services } from '~/data/services'
import type { Stop, Service, Stage } from '~~/shared/types'

// Pre-built indexes for O(1) lookups (built once on module load)
const stopsById = new Map<number, Stop>(stops.map((s) => [s.id, s]))
const stagesById = new Map<number, Stage>(stages.map((s) => [s.id, s]))
const servicesById = new Map<number, Service>(services.map((s) => [s.id, s]))

const stopsByStage = new Map<number, Stop[]>()
for (const s of stops) {
  const list = stopsByStage.get(s.stage)
  if (list) {
    list.push(s)
  } else {
    stopsByStage.set(s.stage, [s])
  }
}

const servicesByStopId = new Map<number, Service[]>()
const servicesByCategory = new Map<string, Service[]>()
for (const s of services) {
  const byStop = servicesByStopId.get(s.stopId)
  if (byStop) {
    byStop.push(s)
  } else {
    servicesByStopId.set(s.stopId, [s])
  }

  const byCat = servicesByCategory.get(s.category)
  if (byCat) {
    byCat.push(s)
  } else {
    servicesByCategory.set(s.category, [s])
  }
}

export function useTrailData() {
  function getStop(id: number): Stop | undefined {
    return stopsById.get(id)
  }

  function getNextStop(id: number): Stop | undefined {
    return stopsById.get(id + 1)
  }

  function getPrevStop(id: number): Stop | undefined {
    return stopsById.get(id - 1)
  }

  function getStage(id: number): Stage | undefined {
    return stagesById.get(id)
  }

  function getStopsByStage(stageId: number): Stop[] {
    return stopsByStage.get(stageId) ?? []
  }

  function getNearbyServices(stopId: number): Service[] {
    return servicesByStopId.get(stopId) ?? []
  }

  function getServicesByCategory(category: string): Service[] {
    return servicesByCategory.get(category) ?? []
  }

  function getService(id: number): Service | undefined {
    return servicesById.get(id)
  }

  function estimateWalkingTime(distanceKm: number): number {
    return Math.round((distanceKm / 4) * 60)
  }

  function distanceBetweenStops(from: Stop, to: Stop): number {
    return haversineDistance(from.lat, from.lng, to.lat, to.lng, 'km')
  }

  return {
    stops,
    stages,
    services,
    getStop,
    getNextStop,
    getPrevStop,
    getStage,
    getStopsByStage,
    getNearbyServices,
    getServicesByCategory,
    getService,
    estimateWalkingTime,
    distanceBetweenStops,
  }
}
