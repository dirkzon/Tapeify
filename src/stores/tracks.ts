import type { Track } from '@/types/tapeify/models'
import { defineStore } from 'pinia'

export const useTracksStore = defineStore('tracks', {
  state: () => ({
    _masterTrackList: [] as Track[],
    unavailableTrackIds: [] as string[],
  }),
  getters: {
    availableTracksTotalDuration(): number {
      return this.availableTracks.reduce((acc, track) => acc + track.durationMs, 0)
    },
    availableTracks(state): Track[] {
      return state._masterTrackList.filter(track => !state.unavailableTrackIds.includes(track.id))
    },
    unavailableTracks(state): Track[] {
      return state._masterTrackList.filter(track => state.unavailableTrackIds.includes(track.id))
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
    TrackExists(trackId: string): boolean {
      return this._masterTrackList.some(track => track.id === trackId)
    },
    MarkTrackAsUnavailable(trackId: string) {
      if (!this.unavailableTrackIds.includes(trackId) && this.TrackExists(trackId)) {
        this.unavailableTrackIds.push(trackId)
      }
    },
    MarkTrackAsAvailable(trackId: string) {
      this.unavailableTrackIds = this.unavailableTrackIds.filter(id => id !== trackId)
    },
  }
})
