import type { AlertRule } from "@/types/tapeify/models";
import { useCassettesStore } from "./cassette";

export const CASSETTE_ALERT_RULES: AlertRule[] = [
  {
    when: (cassette, sides) => sides[0]?.durationMs === 0 && sides[1]?.durationMs === 0,
    message: 'Cassette is empty.',
    priority: 10,
    action: (cassette, sides) => ({
      fn: () => {
        const cassetteStore = useCassettesStore()
        cassetteStore.removeCassette(cassette.id)
      },
      message: 'Remove cassette',
    }),
  },
  {
    when: (cassette, sides) => sides[0]?.durationMs === 0,
    priority: 5,
    message: 'Side A is empty.',
  },
  {
    when: (cassette, sides) => sides[1]?.durationMs === 0,
    priority: 5,
    message: 'Side B is empty.',
  },
]
