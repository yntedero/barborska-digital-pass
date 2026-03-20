/**
 * Reusable table sort state and helpers for admin tables.
 */
export function useTableSort<T extends string>(defaultKey: T) {
  const sortKey = ref<T>(defaultKey) as Ref<T>
  const sortAsc = ref(false)

  function toggleSort(key: T): void {
    if (sortKey.value === key) {
      sortAsc.value = !sortAsc.value
    } else {
      sortKey.value = key
      sortAsc.value = false
    }
  }

  function sortIcon(key: T): string {
    if (sortKey.value !== key) return 'i-lucide-arrow-up-down'
    return sortAsc.value ? 'i-lucide-arrow-up' : 'i-lucide-arrow-down'
  }

  return {
    sortKey,
    sortAsc,
    toggleSort,
    sortIcon,
  }
}
