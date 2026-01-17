import type { AlertRule } from "@/types/tapeify/models";
import { useCassettesStore } from "./cassette";
import { useSortingStore } from "./sorting";

const emptyCassetteRule: AlertRule = {
  when: (cassette, sides) =>
    sides[0]?.durationMs === 0 && sides[1]?.durationMs === 0,

  message: () => 'Cassette is empty.',
  priority: () => 10,

  action: (cassette) => ({
    fn: () => {
      const cassetteStore = useCassettesStore()
      cassetteStore.removeCassette(cassette.id)
    },
    message: 'Remove cassette',
  }),
}

const emptySideARule: AlertRule = {
  when: (cassette, sides) => sides[0]?.durationMs === 0,
  message: () => 'Side A is empty.',
  priority: () => 5,
}

const emptySideBRule: AlertRule = {
  when: (cassette, sides) => sides[1]?.durationMs === 0,
  message: () => 'Side B is empty.',
  priority: () => 5,
}

type ShorterCassettePayload = {
  suggestedCapacityMs: number
  label: string
}

const shorterCassetteRule: AlertRule<ShorterCassettePayload> = {
  when: (cassette, sides) => {
    const cassetteStore = useCassettesStore()
    const possibleLengthsMs = cassetteStore.possibleLengthsMin.map(m => m * 60_000)

    const longestSide = Math.max(
      sides[0]?.durationMs ?? 0,
      sides[1]?.durationMs ?? 0
    )

    const fitLengthMs = possibleLengthsMs.find(len => len >= longestSide)

    if (!fitLengthMs || cassette.capacityMs <= fitLengthMs) return false

    return {
      suggestedCapacityMs: fitLengthMs,
      label: `${fitLengthMs / 60_000} min`,
    }
  },

  message: (_cassette, _sides, payload) =>
    `Cassette can fit in ${payload!.label}.`,

  priority: () => 2,

  action: (cassette, _sides, payload) => ({
    fn: () => {
      const sortStore = useSortingStore()
      cassette.capacityMs = payload!.suggestedCapacityMs
      sortStore.sortTracks()
    },
    message: `Set capacity to ${payload!.label}`,
  }),
}

export const CASSETTE_ALERT_RULES: AlertRule<any>[] = [
  emptyCassetteRule,
  emptySideARule,
  emptySideBRule,
  shorterCassetteRule,
]
