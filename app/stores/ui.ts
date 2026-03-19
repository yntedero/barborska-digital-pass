import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', () => {
  const mobileMenuOpen = ref(false)
  const serviceFilters = ref<string[]>([])

  function toggleMenu() {
    mobileMenuOpen.value = !mobileMenuOpen.value
  }

  function closeMenu() {
    mobileMenuOpen.value = false
  }

  function toggleServiceFilter(category: string) {
    const idx = serviceFilters.value.indexOf(category)
    if (idx === -1) {
      serviceFilters.value.push(category)
    } else {
      serviceFilters.value.splice(idx, 1)
    }
  }

  function clearServiceFilters() {
    serviceFilters.value = []
  }

  return {
    mobileMenuOpen,
    serviceFilters,
    toggleMenu,
    closeMenu,
    toggleServiceFilter,
    clearServiceFilters,
  }
})
