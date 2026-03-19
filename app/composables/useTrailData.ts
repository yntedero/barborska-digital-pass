import { stops } from '~/data/stops'
import { stages } from '~/data/stages'
import { services } from '~/data/services'
import type { Stop, Service, Stage } from '~~/shared/types'

export function useTrailData() {
  function getStop(id: number): Stop | undefined {
    return stops.find(s => s.id === id)
  }

  function getNextStop(id: number): Stop | undefined {
    return stops.find(s => s.id === id + 1)
  }

  function getPrevStop(id: number): Stop | undefined {
    return stops.find(s => s.id === id - 1)
  }

  function getStage(id: number): Stage | undefined {
    return stages.find(s => s.id === id)
  }

  function getStopsByStage(stageId: number): Stop[] {
    return stops.filter(s => s.stage === stageId)
  }

  function getNearbyServices(stopId: number): Service[] {
    return services.filter(s => s.stopId === stopId)
  }

  function getServicesByCategory(category: string): Service[] {
    return services.filter(s => s.category === category)
  }

  function getService(id: number): Service | undefined {
    return services.find(s => s.id === id)
  }

  function estimateWalkingTime(distanceKm: number): number {
    return Math.round((distanceKm / 4) * 60)
  }

  function distanceBetweenStops(from: Stop, to: Stop): number {
    const R = 6371
    const toRad = (deg: number) => (deg * Math.PI) / 180
    const dLat = toRad(to.lat - from.lat)
    const dLng = toRad(to.lng - from.lng)
    const a
      = Math.sin(dLat / 2) ** 2
        + Math.cos(toRad(from.lat)) * Math.cos(toRad(to.lat)) * Math.sin(dLng / 2) ** 2
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
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
    distanceBetweenStops
  }
}
