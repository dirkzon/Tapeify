import { defineStore } from 'pinia'
import type {
  Cassette,
  CassetteAlert,
  CassetteMetadata,
  TapeSideLayout,
} from '@/types/tapeify/models'
import { v4 as uuidv4 } from 'uuid'
import { CASSETTE_ALERT_RULES } from './cassette.alert.rules'
import { usePlaylistsStore } from './playlists'
import { useTracksStore } from './tracks'
import { useLayoutStore } from './layout'

export const useCassettesStore = defineStore('cassettes', {
  state: () => ({
    possibleLengthsMin: [30, 45, 60, 90, 120],
    metadata: {} as CassetteMetadata,
    cassettes: [
      { id: 'default', name: 'My First Cassette', capacityMs: 90 * 60000, sidesCount: 2 },
    ] as Cassette[],
    alerts: {} as Record<string, CassetteAlert>,
  }),

  getters: {
    getCassetteById: (state) => {
      return (cassetteId: string) =>
        state.cassettes.find(cassette => cassette.id === cassetteId)
    },
    alertForCassette: (state) => (cassetteId: string): CassetteAlert | undefined => {
      return state.alerts[cassetteId]
    },
  },
  actions: {
    addCassette() {
      this.cassettes.push({
        id: uuidv4(),
        name: `${this.metadata.item_name} ${this.cassettes.length + 1}`,
        capacityMs: 90 * 60000,
        sidesCount: 2
      })
    },

    removeCassette(cassetteId: string) {
      this.cassettes = this.cassettes.filter(c => c.id !== cassetteId)
      delete this.alerts[cassetteId]
    },

    updateName(cassetteId: string, newName: string) {
      const cassette = this.getCassetteById(cassetteId)
      if (cassette) {
        cassette.name = newName
      }
    },

    updateCapacity(cassetteId: string, newCapacityMs: number) {
      const cassette = this.getCassetteById(cassetteId)
      if (cassette) {
        cassette.capacityMs = newCapacityMs
      }
    },

    updateSidesCount(cassetteId: string, newSidesCount: number) {
      if (newSidesCount < 1) {
        throw new Error("New sides count cannot be less than 1.")
      }
      const cassette = this.getCassetteById(cassetteId)
      if (cassette) {
        cassette.sidesCount = newSidesCount
      }
    },

    updateMetadata(newMetadata: CassetteMetadata) {
      this.metadata = newMetadata
    },
    initAlerts() {
      const layoutStore = useLayoutStore()

      layoutStore.$subscribe((_mutation, state) => {
        this.alerts = {}

        for (const cassetteId in state.cassettesLayout) {
          const cassette = this.getCassetteById(cassetteId)
          if (!cassette) continue

          this._createAlertsForCassette(state.cassettesLayout[cassetteId].sides, cassette)
        }
      })
    },
    _createAlertsForCassette(
      sides: TapeSideLayout[],
      cassette: Cassette
    ) {
      for (const rule of CASSETTE_ALERT_RULES) {
        const payload = rule.when(cassette, sides)
        if (!payload) continue

        if (!this.alerts[cassette.id]) {
          this.alerts[cassette.id] = {
            message: rule.message(cassette, sides, payload),
            action: rule.action?.(cassette, sides, payload),
            priority: rule.priority(cassette, sides, payload),
          }
        } else {
          const existingAlert = this.alerts[cassette.id]
          if (rule.priority(cassette, sides, payload) > existingAlert.priority) {
            this.alerts[cassette.id] = {
              message: rule.message(cassette, sides, payload),
              action: rule.action?.(cassette, sides, payload),
              priority: rule.priority(cassette, sides, payload),
            }
          }
        }
      }
    },
    async uploadCassette() {
      const layoutStore = useLayoutStore()
      const playlistStore = usePlaylistsStore()
      const trackStore = useTracksStore()

      for (const cassette of this.cassettes) {
        const layouts = layoutStore.getLayoutByCassetteId(cassette.id)
        if (layouts == undefined) {
          break
        }
        for (const layout of layouts.sides) {
          const trackUris = layout.trackIds.map(id => trackStore.GetTrackById(id)?.uri).filter(uri => uri !== undefined)

          const playlist = await playlistStore.UploadNewPlaylist(`${cassette.name} side ${String.fromCharCode(65 + layout.sideIndex)}`, "Made with Tapeify", false)
          await playlistStore.UploadTracksToPlaylists(playlist.id, trackUris)
        }
      }
    }
  },
})
