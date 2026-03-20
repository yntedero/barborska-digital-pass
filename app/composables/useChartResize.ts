/**
 * Dispatches a window resize event after mount so ECharts
 * correctly calculates its container dimensions.
 */
export function useChartResize(): void {
  onMounted(() => {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'))
    }, 200)
  })
}
