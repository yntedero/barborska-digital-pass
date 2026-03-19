<template>
  <div
    class="w-full overflow-hidden"
    :class="[
      fullHeight ? 'h-full' : 'h-56 md:h-72',
      fullHeight
        ? ''
        : 'rounded-xl border border-(--color-sand-200) dark:border-(--color-sand-700)',
    ]"
  >
    <!-- Loading fallback -->
    <div
      v-if="!mapLoaded"
      class="w-full h-full flex items-center justify-center bg-(--color-sand-100) dark:bg-(--color-sand-800)"
    >
      <div class="text-center">
        <UIcon
          name="i-lucide-map"
          class="size-8 text-(--color-sand-300) dark:text-(--color-sand-600) mx-auto mb-1 animate-pulse"
        />
        <p class="text-xs text-(--color-sand-400)">
          {{ $t('map.loadingMap') }}
        </p>
      </div>
    </div>

    <LMap
      v-show="mapLoaded"
      :zoom="zoom"
      :center="mapCenter"
      :use-global-leaflet="false"
      :options="{
        zoomControl: interactive,
        dragging: interactive,
        scrollWheelZoom: interactive,
        touchZoom: interactive,
        doubleClickZoom: interactive,
        attributionControl: false,
      }"
      class="w-full h-full z-0"
    >
      <LTileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap"
        :options="{ maxZoom: 18 }"
      />

      <!-- Trail polyline -->
      <LPolyline
        v-if="trailCoords.length >= 2"
        :lat-lngs="trailCoords"
        :options="{
          color: '#c49225',
          weight: 4,
          opacity: 0.7,
          dashArray: showAllStops ? undefined : '8, 8',
        }"
      />

      <!-- User position marker (pulsing blue dot) -->
      <LMarker
        v-if="userPosition"
        :lat-lng="[userPosition.lat, userPosition.lng]"
        :options="{ zIndexOffset: 2000 }"
      >
        <LIcon
          :icon-size="[20, 20]"
          :icon-anchor="[10, 10]"
          class-name="user-location-marker"
        >
          <div class="relative w-5 h-5">
            <div class="absolute inset-0 bg-blue-500/30 rounded-full animate-ping" />
            <div
              class="absolute inset-1 bg-blue-500 rounded-full border-2 border-white shadow-md"
            />
          </div>
        </LIcon>
      </LMarker>

      <!-- Current stop marker (highlighted) -->
      <LMarker
        v-if="!showAllStops"
        :lat-lng="[stop.lat, stop.lng]"
        :options="{ zIndexOffset: 1000 }"
      >
        <LIcon
          :icon-size="[32, 32]"
          :icon-anchor="[16, 32]"
          :popup-anchor="[0, -28]"
          class-name="current-stop-marker"
        >
          <div
            class="w-8 h-8 bg-gradient-to-b from-(--color-gold-400) to-(--color-gold-600) rounded-full border-3 border-white shadow-lg flex items-center justify-center"
          >
            <span class="text-white text-xs font-bold">{{ stop.id }}</span>
          </div>
        </LIcon>
        <LPopup>
          <div class="text-center">
            <p class="font-bold text-sm">
              {{ stop.name }}
            </p>
            <p class="text-xs text-gray-500">{{ $t('stop.stopLabel') }} {{ stop.id }}</p>
          </div>
        </LPopup>
      </LMarker>

      <!-- All stops (for full map view) -->
      <template v-if="showAllStops">
        <LMarker
          v-for="s in allStops"
          :key="`stop-${s.id}`"
          :lat-lng="[s.lat, s.lng]"
          @click="handleStopClick(s.id)"
        >
          <LIcon
            :icon-size="[24, 24]"
            :icon-anchor="[12, 24]"
            :popup-anchor="[0, -20]"
          >
            <div
              class="w-6 h-6 bg-gradient-to-b from-(--color-gold-400) to-(--color-gold-600) rounded-full border-2 border-white shadow-md flex items-center justify-center cursor-pointer"
            >
              <span class="text-white text-[9px] font-bold">{{ s.id }}</span>
            </div>
          </LIcon>
          <LPopup>
            <div class="text-center">
              <p class="font-bold text-sm">
                {{ s.name }}
              </p>
              <p class="text-xs text-gray-500">{{ $t('stop.stopLabel') }} {{ s.id }}</p>
            </div>
          </LPopup>
        </LMarker>
      </template>

      <!-- Prev/Next stop markers (smaller, clickable) -->
      <template v-if="!showAllStops">
        <LMarker
          v-for="s in displayStops"
          :key="`adj-${s.id}`"
          :lat-lng="[s.lat, s.lng]"
          @click="handleStopClick(s.id)"
        >
          <LIcon
            :icon-size="[20, 20]"
            :icon-anchor="[10, 20]"
            :popup-anchor="[0, -16]"
          >
            <div
              class="w-5 h-5 bg-(--color-sand-400) rounded-full border-2 border-white shadow flex items-center justify-center cursor-pointer hover:bg-(--color-gold-500) transition-colors"
            >
              <span class="text-white text-[8px] font-bold">{{ s.id }}</span>
            </div>
          </LIcon>
          <LPopup>
            <div class="text-center">
              <p class="font-bold text-xs">
                {{ s.name }}
              </p>
            </div>
          </LPopup>
        </LMarker>
      </template>

      <!-- Nearby service markers -->
      <LMarker
        v-for="svc in displayServices"
        :key="`svc-${svc.id}`"
        :lat-lng="[svc.lat, svc.lng]"
        @click="emit('serviceClick', svc.id)"
      >
        <LIcon
          :icon-size="[18, 18]"
          :icon-anchor="[9, 18]"
          :popup-anchor="[0, -14]"
        >
          <div
            class="w-[18px] h-[18px] rounded-md border-2 border-white shadow flex items-center justify-center cursor-pointer"
            :style="{ backgroundColor: CATEGORY_COLORS[svc.category] || '#7a6e5a' }"
          >
            <span class="text-white text-[7px] font-bold">
              {{ svc.category.charAt(0).toUpperCase() }}
            </span>
          </div>
        </LIcon>
        <LPopup>
          <div class="text-center">
            <p class="font-bold text-xs">
              {{ svc.name }}
            </p>
            <p class="text-[10px] text-gray-500">
              {{ svc.distance }}
            </p>
          </div>
        </LPopup>
      </LMarker>
    </LMap>
  </div>
</template>

<script setup lang="ts">
import type { Stop } from '~~/shared/types'
import { CATEGORY_COLORS } from '~/data/services'

const props = withDefaults(
  defineProps<{
    stop: Stop
    showNearby?: boolean
    showAllStops?: boolean
    showAllServices?: boolean
    fullHeight?: boolean
    interactive?: boolean
    userPosition?: { lat: number; lng: number } | null
  }>(),
  {
    showNearby: true,
    showAllStops: false,
    showAllServices: false,
    fullHeight: false,
    interactive: true,
    userPosition: null,
  },
)

const emit = defineEmits<{
  stopClick: [stopId: number]
  serviceClick: [serviceId: number]
}>()

const { getNextStop, getPrevStop, getNearbyServices, stops: allStops } = useTrailData()
const { services: allServices } = useTrailData()

const prevStop = computed(() => getPrevStop(props.stop.id))
const nextStop = computed(() => getNextStop(props.stop.id))
const nearbyServices = computed(() => getNearbyServices(props.stop.id))

const displayStops = computed(() => {
  if (props.showAllStops) return allStops
  const result: Stop[] = []
  if (prevStop.value) result.push(prevStop.value)
  if (nextStop.value) result.push(nextStop.value)
  return result
})

const displayServices = computed(() => {
  if (props.showAllServices) return allServices
  if (props.showNearby) return nearbyServices.value
  return []
})

// Trail polyline — use LatLngTuple format explicitly
const trailCoords = computed((): [number, number][] => {
  if (props.showAllStops) {
    return allStops.map((s) => [s.lat, s.lng] as [number, number])
  }
  const points: [number, number][] = []
  if (prevStop.value) points.push([prevStop.value.lat, prevStop.value.lng])
  points.push([props.stop.lat, props.stop.lng])
  if (nextStop.value) points.push([nextStop.value.lat, nextStop.value.lng])
  return points
})

const mapCenter = computed(() => [props.stop.lat, props.stop.lng] as [number, number])

const zoom = computed(() => {
  if (props.showAllStops) return 10
  return 14
})

// Loading state + invalidateSize fix
const mapLoaded = ref(false)
onMounted(() => {
  setTimeout(() => {
    mapLoaded.value = true
    // Fix Leaflet tile rendering by invalidating size after container is visible
    nextTick(() => {
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'))
      }, 200)
    })
  }, 100)
})

function handleStopClick(stopId: number) {
  if (stopId !== props.stop.id) {
    emit('stopClick', stopId)
  }
}
</script>
