import { defineStore } from 'pinia'
import type {
  Cassette,
  CassetteAlert,
  CassetteMetadata,
  TapeSideLayout,
} from '@/types/tapeify/models'
import { v4 as uuidv4 } from 'uuid'
import { useSortingStore } from './sorting'
import { CASSETTE_ALERT_RULES } from './cassette.alert.rules'

export const useCassettesStore = defineStore('cassettes', {
  state: () => ({
    possibleLengthsMin: [60, 90, 120],
    metadata: {} as CassetteMetadata,
    cassettes: [
      { id: 'default', name: 'My First Cassette', capacityMs: 90 * 60000 },
    ] as Cassette[],
    alerts: [] as CassetteAlert[],
  }),

  getters: {
    getCassetteById: (state) => {
      return (cassetteId: string) =>
        state.cassettes.find(cassette => cassette.id === cassetteId)
    },
    alertsForCassette: (state) => (cassetteId: string): CassetteAlert[] =>
      state.alerts.filter(alert => alert.cassetteId === cassetteId),
    topAlertForCassette: (state) => (cassetteId: string): CassetteAlert | undefined => {
      const alertsForCassette = state.alerts.filter(alert => alert.cassetteId === cassetteId)
      if (alertsForCassette.length === 0) return undefined
      return alertsForCassette.reduce((prev, current) => {
        return (current.priority > prev.priority) ? current : prev;
      })
    },
  },
  actions: {
    addCassette() {
      this.cassettes.push({
        id: uuidv4(),
        name: `${this.metadata.item_name} ${this.cassettes.length + 1}`,
        capacityMs: 90 * 60000,
      })
    },

    removeCassette(cassetteId: string) {
      this.cassettes = this.cassettes.filter(c => c.id !== cassetteId)
      this.alerts = this.alerts.filter(a => a.cassetteId !== cassetteId)
    },

    updateName(cassetteId: string, newName: string) {
      const cassette = this.getCassetteById(cassetteId)
      if (cassette) {
        cassette.name = `${newName} ${this.cassettes.length}`
      }
    },

    updateCapacity(cassetteId: string, newCapacityMs: number) {
      const cassette = this.getCassetteById(cassetteId)
      if (cassette) {
        cassette.capacityMs = newCapacityMs
      }
    },

    updateMetadata(newMetadata: CassetteMetadata) {
      this.metadata = newMetadata
    },
    initAlerts() {
      const sortStore = useSortingStore()

      sortStore.$subscribe((_mutation, state) => {
        this.alerts = []

        const sidesByCassette: Record<
          string,
          Record<number, TapeSideLayout>
        > = {}

        for (const side of Object.values(state.layout)) {
          if (!sidesByCassette[side.cassetteId]) {
            sidesByCassette[side.cassetteId] = {}
          }

          sidesByCassette[side.cassetteId][side.sideIndex] = side
        }

        for (const cassetteId in sidesByCassette) {
          const cassette = this.getCassetteById(cassetteId)
          if (!cassette) continue

          this._createAlertsForCassette(
            sidesByCassette[cassetteId],
            cassette
          )
        }
      })
    },
    _createAlertsForCassette(
      sides: Record<number, TapeSideLayout>,
      cassette: Cassette
    ) {
      for (const rule of CASSETTE_ALERT_RULES) {
        const payload = rule.when(cassette, sides)
        if (!payload) continue

        this.alerts.push({
          cassetteId: cassette.id,
          message: rule.message(cassette, sides, payload),
          action: rule.action?.(cassette, sides, payload),
          priority: rule.priority(cassette, sides, payload),
        })
      }
    }
  },
})
