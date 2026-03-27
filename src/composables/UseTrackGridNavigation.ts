import { computed, ref } from "vue"
import { useSortingStore } from "@/stores/sorting"
import { useCassettesStore } from "@/stores/cassette"

export function useTrackGridNavigation() {
  const sorting = useSortingStore()
  const cassetteStore = useCassettesStore()

  const focused = ref<{ row: number; col: number } | null>(null)

  const columnCount = computed(() => cassetteStore.cassettes.length * 2)

  const grid = computed(() => {
    const columns: string[][] = []

    for (const cassette of cassetteStore.cassettes) {
      for (let side = 0; side < 2; side++) {
        const layout = sorting.getLayoutbyCassetteAndSide(cassette.id, side)
        columns.push(layout?.trackIds ?? [])
      }
    }

    const rows = Math.max(...columns.map(c => c.length))

    const result: (string | null)[][] = []

    for (let r = 0; r < rows; r++) {
      const row: (string | null)[] = []

      for (let c = 0; c < columns.length; c++) {
        row.push(columns[c][r] ?? null)
      }

      result.push(row)
    }

    return result
  })

  function focusCell(row: number, col: number) {
    const trackId = grid.value[row]?.[col]
    if (!trackId) return

    focused.value = { row, col }

    requestAnimationFrame(() => {
      const el = document.querySelector(
        `[data-track-id="${trackId}"]`
      ) as HTMLElement | null

      el?.focus()
    })
  }

  function move(dx: number, dy: number) {
    if (!focused.value) return

    const r = focused.value.row + dy
    const c = focused.value.col + dx

    if (r < 0 || c < 0) return
    if (c >= columnCount.value) return
    if (r >= grid.value.length) return

    focusCell(r, c)
  }

  return {
    grid,
    focused,
    focusCell,
    move
  }
}