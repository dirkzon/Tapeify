import type { Track } from '@/types/tapeify/models'
import { defineStore } from 'pinia'

export const useTracksStore = defineStore('tracks', {
  state: () => ({
    _masterTrackList: [] as Track[],
    _unavailableTrackIds: [] as string[],
  }),
  getters: {
    availableTracksTotalDuration(): number {
      return this.availableTracks.reduce((acc, track) => acc + track.durationMs, 0)
    },
    availableTracks(state): Track[] {
      return state._masterTrackList.filter(track => !state._unavailableTrackIds.includes(track.id))
    },
    unavailableTracks(state): Track[] {
      return state._masterTrackList.filter(track => state._unavailableTrackIds.includes(track.id))
    }
  },
  actions: {
    AddTrackToMasterList(track: Track) {
      this._masterTrackList.push(track)
    },
    ClearMasterTrackList() {
      this._masterTrackList = []
    },
    GetTrackById(trackId: string): Track | undefined {
      return this._masterTrackList.find(track => track.id === trackId)
    },
    MarkTrackAsUnavailable(trackId: string) {
      if (!this._unavailableTrackIds.includes(trackId)) {
        this._unavailableTrackIds.push(trackId)
      }
    },
    MarkTrackAsAvailable(trackId: string) {
      this._unavailableTrackIds = this._unavailableTrackIds.filter(id => id !== trackId)
    },
  }
})
