import type { AlertRule } from "@/types/tapeify/models";
import { useCassettesStore } from "./cassette";
import { useLayoutStore } from "./layout";

const emptyCassetteRule: AlertRule = {
  when: (cassette, sides) => {
    const durations = (sides || []).map(s => Number(s?.durationMs) || 0);
    return durations.every(d => d === 0);
  },

  message: () => 'Cassette is empty.',
  priority: () => 10,

  action: (cassette) => ({
    fn: () => {
      const cassetteStore = useCassettesStore();
      cassetteStore.removeCassette(cassette.id);
    },
    message: 'Remove cassette',
  }),
};

type EmptySidePayload = { sideIndex: number }

const emptySideRule: AlertRule<EmptySidePayload> = {
  when: (_cassette, sides) => {
    if (!Array.isArray(sides)) return false
    const idx = sides.findIndex(s => (Number(s?.durationMs) || 0) === 0)
    if (idx === -1) return false
    return { sideIndex: idx }
  },

  message: (_cassette, _sides, payload) =>
    `Side ${String.fromCharCode(65 + payload!.sideIndex)} is empty.`,

  priority: () => 5,
}

type ShorterCassettePayload = {
  suggestedCapacityMs: number;
  label: string;
};

const shorterCassetteRule: AlertRule<ShorterCassettePayload> = {
  when: (cassette, sides) => {
    const cassetteStore = useCassettesStore();

    const possibleCapacitiesMs = cassetteStore.possibleLengthsMin.map(
      m => m * 60_000
    );

    const longestSide = Math.max(
      0,
      ...(Array.isArray(sides) ? sides.map(s => Number(s?.durationMs) || 0) : [])
    );

    const suggestedCapacity = possibleCapacitiesMs.find(
      total => total / (cassette.sidesCount || 1) >= longestSide
    );

    if (!suggestedCapacity || cassette.capacityMs <= suggestedCapacity) return false;

    return {
      suggestedCapacityMs: suggestedCapacity,
      label: `${suggestedCapacity / 60_000} min`,
    };
  },

  message: (_cassette, _sides, payload) =>
    `Cassette can fit in ${payload!.label}.`,

  priority: () => 8,

  action: (cassette, _sides, payload) => ({
    fn: () => {
      const layoutStore = useLayoutStore();
      cassette.capacityMs = payload!.suggestedCapacityMs;
      layoutStore.calculateLayout();
    },
    message: `Set capacity to ${payload!.label}`,
  }),
};

type ExpandCassettePayload = {
  suggestedCapacityMs: number;
  label: string;
};

const expandCassetteRule: AlertRule<ExpandCassettePayload> = {
  when: (cassette, sides) => {
    const cassetteStore = useCassettesStore();

    const possibleCapacitiesMs = cassetteStore.possibleLengthsMin.map(
      m => m * 60_000
    );

    const totalDuration = (Array.isArray(sides)
      ? sides.reduce((sum, s) => sum + (Number(s?.durationMs) || 0), 0)
      : 0);

    const requiredPerSide = totalDuration / (cassette.sidesCount || 1);

    const requiredTotal = possibleCapacitiesMs.find(
      total => total / (cassette.sidesCount || 1) >= requiredPerSide
    );

    if (!requiredTotal || cassette.capacityMs >= requiredTotal) return false;

    return {
      suggestedCapacityMs: requiredTotal,
      label: `${requiredTotal / 60_000} min`,
    };
  },

  message: (_cassette, _sides, payload) =>
    `Cassette too short. Needs at least ${payload!.label}.`,

  priority: () => 8,

  action: (cassette, _sides, payload) => ({
    fn: () => {
      const layoutStore = useLayoutStore();
      cassette.capacityMs = payload!.suggestedCapacityMs;
      layoutStore.calculateLayout();
    },
    message: `Expand to ${payload!.label}`,
  }),
};

type AddCassettePayload = {
  totalDurationMs: number;
  largestCapacityMs: number;
  label: string;
};

const needsNewCassetteRule: AlertRule<AddCassettePayload> = {
  when: (_cassette, sides) => {
    const cassetteStore = useCassettesStore();

    const possibleCapacitiesMs = cassetteStore.possibleLengthsMin.map(
      m => m * 60_000
    );

    const largestCapacity = Math.max(...possibleCapacitiesMs);

    const totalDuration = (Array.isArray(sides)
      ? sides.reduce((sum, s) => sum + (Number(s?.durationMs) || 0), 0)
      : 0);

    if (totalDuration > largestCapacity) {
      return {
        totalDurationMs: totalDuration,
        largestCapacityMs: largestCapacity,
        label: `${largestCapacity / 60_000} min`,
      };
    }

    return false;
  },

  message: (_cassette, _sides, payload) =>
    `Total program is ${Math.ceil(payload!.totalDurationMs / 60_000)} min — exceeds largest cassette (${payload!.label}).`,

  priority: () => 10,

  action: (_cassette) => ({
    fn: () => {
      const cassetteStore = useCassettesStore();
      const layoutStore = useLayoutStore();

      cassetteStore.addCassette();
      layoutStore.calculateLayout();
    },
    message: "Add another cassette",
  }),
};

export const CASSETTE_ALERT_RULES: AlertRule<any>[] = [
  emptyCassetteRule,
  emptySideRule,
  shorterCassetteRule,
  expandCassetteRule,
  needsNewCassetteRule,
];
