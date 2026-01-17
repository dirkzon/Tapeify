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

    const possibleCapacitiesMs = cassetteStore.possibleLengthsMin.map(
      m => m * 60_000
    )

    const longestSide = Math.max(
      sides[0].durationMs ?? 0,
      sides[1].durationMs ?? 0
    )

    const suggestedCapacity = possibleCapacitiesMs.find(
      total => total / 2 >= longestSide
    )

    if (!suggestedCapacity || cassette.capacityMs <= suggestedCapacity)
      return false

    return {
      suggestedCapacityMs: suggestedCapacity,
      label: `${suggestedCapacity / 60_000} min`,
    }
  },

  message: (_cassette, _sides, payload) =>
    `Cassette can fit in ${payload!.label}.`,

  priority: () => 8,

  action: (cassette, _sides, payload) => ({
    fn: () => {
      const sortStore = useSortingStore()
      cassette.capacityMs = payload!.suggestedCapacityMs
      sortStore.sortTracks()
    },
    message: `Set capacity to ${payload!.label}`,
  }),
}

type ExpandCassettePayload = {
  suggestedCapacityMs: number
  label: string
}

const expandCassetteRule: AlertRule<ExpandCassettePayload> = {
  when: (cassette, sides) => {
    const cassetteStore = useCassettesStore()

    const possibleCapacitiesMs = cassetteStore.possibleLengthsMin.map(
      m => m * 60_000
    )

    const totalDuration = (sides[0]?.durationMs ?? 0) + (sides[1]?.durationMs ?? 0)

    const requiredPerSide = totalDuration / 2

    const requiredTotal = possibleCapacitiesMs.find(
      total => total / 2 >= requiredPerSide
    )

    if (!requiredTotal || cassette.capacityMs >= requiredTotal)
      return false

    return {
      suggestedCapacityMs: requiredTotal,
      label: `${requiredTotal / 60_000} min`,
    }
  },

  message: (_cassette, _sides, payload) =>
    `Cassette too short. Needs at least ${payload!.label}.`,

  priority: () => 8,

  action: (cassette, _sides, payload) => ({
    fn: () => {
      const sortStore = useSortingStore()
      cassette.capacityMs = payload!.suggestedCapacityMs
      sortStore.sortTracks()
    },
    message: `Expand to ${payload!.label}`,
  }),
}

type AddCassettePayload = {
  totalDurationMs: number
  largestCapacityMs: number
  label: string
}

const needsNewCassetteRule: AlertRule<AddCassettePayload> = {
  when: (cassette, sides) => {
    const cassetteStore = useCassettesStore()

    const possibleCapacitiesMs = cassetteStore.possibleLengthsMin.map(
      m => m * 60_000
    )

    const largestCapacity = Math.max(...possibleCapacitiesMs)

    const totalDuration =
      (sides[0]?.durationMs ?? 0) + (sides[1]?.durationMs ?? 0)

    if (totalDuration > largestCapacity) {
      return {
        totalDurationMs: totalDuration,
        largestCapacityMs: largestCapacity,
        label: `${largestCapacity / 60_000} min`
      }
    }

    return false
  },

  message: (_cassette, _sides, payload) =>
    `Total program is ${Math.ceil(
      payload!.totalDurationMs / 60_000
    )} min — exceeds largest cassette (${payload!.label}).`,

  priority: () => 10,

  action: (_cassette) => ({
    fn: () => {
      const cassetteStore = useCassettesStore()
      const sortStore = useSortingStore()

      cassetteStore.addCassette()
      sortStore.sortTracks()
    },
    message: "Add another cassette",
  }),
}


export const CASSETTE_ALERT_RULES: AlertRule<any>[] = [
  emptyCassetteRule,
  emptySideARule,
  emptySideBRule,
  shorterCassetteRule,
  expandCassetteRule,
  needsNewCassetteRule,
]
