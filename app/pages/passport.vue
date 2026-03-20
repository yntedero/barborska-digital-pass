<template>
  <div class="pb-24">
    <!-- Header -->
    <div class="px-4 pt-6 pb-2">
      <h1
        class="font-heading text-2xl font-bold text-(--color-sand-800) dark:text-(--color-sand-50)"
      >
        {{ t('passport.title') }}
      </h1>
    </div>

    <!-- Progress section -->
    <div class="px-4 py-4">
      <UCard :ui="{ root: 'shadow-lg' }">
        <!-- Subtle background when eligible -->
        <div
          v-if="passport.eligible"
          class="absolute inset-0 bg-gradient-to-br from-(--color-gold-50)/50 to-transparent dark:from-(--color-gold-950)/30 dark:to-transparent pointer-events-none"
          aria-hidden="true"
        />

        <div class="relative">
          <!-- Progress bar -->
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-(--color-sand-700) dark:text-(--color-sand-200)">
              {{ t('passport.progress') }}
            </span>
            <span class="text-sm font-bold text-(--color-gold-500)">{{ passport.progress }}%</span>
          </div>
          <div
            class="w-full h-3 bg-(--color-sand-100) dark:bg-(--color-sand-700) rounded-full overflow-hidden"
          >
            <div
              class="h-full bg-gradient-to-r from-(--color-gold-400) to-(--color-gold-600) rounded-full transition-all duration-700 ease-out"
              :style="{ width: `${passport.progress}%` }"
            />
          </div>

          <!-- Stats -->
          <div class="flex items-center gap-4 mt-4">
            <div class="flex items-center gap-2">
              <div
                class="w-3 h-3 rounded-full bg-gradient-to-br from-(--color-gold-400) to-(--color-gold-600) shadow-sm"
              />
              <span class="text-xs text-(--color-sand-500) dark:text-(--color-sand-400)">
                {{ t('passport.validated') }}:
                <strong class="text-(--color-sand-700) dark:text-(--color-sand-200)">
                  {{ passport.validated }}
                </strong>
              </span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-amber-500 shadow-sm" />
              <span class="text-xs text-(--color-sand-500) dark:text-(--color-sand-400)">
                {{ t('passport.visited') }}:
                <strong class="text-(--color-sand-700) dark:text-(--color-sand-200)">
                  {{ passport.visited }}
                </strong>
              </span>
            </div>
          </div>

          <!-- Certificate eligibility -->
          <div
            class="mt-4 p-3 rounded-lg text-sm transition-all duration-500"
            :class="
              passport.eligible
                ? 'bg-gradient-to-r from-(--color-gold-50) to-(--color-gold-100) dark:from-(--color-gold-950) dark:to-(--color-gold-900)/50 border border-(--color-gold-200)/50 dark:border-(--color-gold-800)/50 text-(--color-gold-700) dark:text-(--color-gold-300) shadow-sm shadow-(--color-gold-500)/10'
                : 'bg-(--color-sand-50) dark:bg-(--color-sand-900) text-(--color-sand-500) dark:text-(--color-sand-400)'
            "
          >
            <div class="flex items-center gap-2">
              <UIcon
                :name="passport.eligible ? 'i-lucide-award' : 'i-lucide-target'"
                class="size-5 flex-shrink-0"
                :class="passport.eligible ? 'text-(--color-gold-500)' : ''"
              />
              <span
                v-if="passport.eligible"
                class="font-semibold"
              >
                {{ t('passport.eligible') }}
              </span>
              <span v-else>
                {{ passport.validated }}/{{ passport.STAMPS_FOR_CERTIFICATE }}
                {{ t('passport.needed') }}
              </span>
            </div>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Stages with stamps -->
    <div class="px-4 space-y-5">
      <UCard
        v-for="stage in stages"
        :key="stage.id"
      >
        <!-- Stage header -->
        <div class="flex items-center gap-3 mb-3">
          <div
            class="w-8 h-8 rounded-xl bg-gradient-to-br from-(--color-gold-100) to-(--color-gold-200) dark:from-(--color-gold-900) dark:to-(--color-gold-950) flex items-center justify-center shadow-sm"
          >
            <span class="text-xs font-bold text-(--color-gold-600) dark:text-(--color-gold-400)">
              {{ stage.id }}
            </span>
          </div>
          <div class="flex-1 min-w-0">
            <p
              class="text-sm font-semibold text-(--color-sand-800) dark:text-(--color-sand-100) truncate"
            >
              {{ stage.from }} → {{ stage.to }}
            </p>
            <p class="text-xs text-(--color-sand-400) dark:text-(--color-sand-500)">
              {{ stage.distance }} km
            </p>
          </div>
        </div>

        <!-- Stop stamps grid -->
        <div class="flex flex-wrap gap-3">
          <div
            v-for="stop in getStopsByStage(stage.id)"
            :key="stop.id"
            class="flex flex-col items-center gap-1 cursor-pointer"
            @click="handleStampClick(stop.id, stop.name)"
          >
            <NuxtLink :to="localePath(`/stop/${stop.id}`)">
              <VisitorStampIcon
                :state="passport.getState(stop.id)"
                :stop-id="stop.id"
                size="md"
              />
            </NuxtLink>
            <span
              class="text-[9px] text-(--color-sand-400) dark:text-(--color-sand-500) text-center max-w-12 truncate"
            >
              {{ stop.name }}
            </span>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Save note callout -->
    <div class="px-4 mt-5">
      <UAlert
        icon="i-lucide-info"
        :description="t('passport.saveNote')"
        color="neutral"
        variant="soft"
      />
    </div>

    <!-- Timestamp modal -->
    <UModal v-model:open="showTimestamp">
      <template #content>
        <div
          v-if="selectedStamp"
          class="p-6 text-center"
        >
          <VisitorStampIcon
            :state="passport.getState(selectedStamp.stopId)"
            :stop-id="selectedStamp.stopId"
            size="lg"
            class="mx-auto mb-3"
          />
          <h3
            class="font-heading text-lg font-bold text-(--color-sand-800) dark:text-(--color-sand-100)"
          >
            {{ selectedStamp.stopName }}
          </h3>
          <p class="text-sm text-(--color-sand-500) dark:text-(--color-sand-400) mt-1">
            {{ selectedStamp.timestamp }}
          </p>
          <UButton
            class="mt-4 min-h-[44px]"
            color="primary"
            variant="soft"
            size="sm"
            @click="closeTimestamp"
          >
            {{ t('common.close') }}
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const { stages, getStopsByStage } = useTrailData()
const passport = usePassportStore()

const selectedStamp = ref<{ stopId: number; stopName: string; timestamp: string } | null>(null)
const showTimestamp = ref(false)

function handleStampClick(stopId: number, stopName: string) {
  const entry = passport.stamps[stopId]
  if (entry?.timestamp && entry.state !== null && entry.state !== 'viewed') {
    selectedStamp.value = {
      stopId,
      stopName,
      timestamp: new Date(entry.timestamp).toLocaleString(),
    }
    showTimestamp.value = true
  }
}

function closeTimestamp() {
  showTimestamp.value = false
  selectedStamp.value = null
}
</script>
