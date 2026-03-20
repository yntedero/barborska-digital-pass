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

  /** Sort an array in place by the current sortKey and sortAsc direction. */
  function sortList<R extends Record<T, string | number>>(list: R[]): R[] {
    return list.sort((a, b) => {
      const aVal = a[sortKey.value]
      const bVal = b[sortKey.value]
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortAsc.value ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
      }
      return sortAsc.value
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number)
    })
  }

  return {
    sortKey,
    sortAsc,
    toggleSort,
    sortIcon,
    sortList,
  }
}
