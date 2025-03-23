import { defineStore } from 'pinia'

const STORE_NAME = 'tracks'

interface Anchor {
  anchored: boolean
  side_index: number
  track_index: number
}

export interface Track {
  name: string
  id: string
  image?: URL
  explicit: boolean
  duration_ms: number
  artists: string[]
  anchor?: Anchor
}

export const UseTracksStore = defineStore(STORE_NAME, {
  state: () => ({
    tracks: [] as Track[]
  }),
  getters: {
    getTracks(state): Track[] {
      return state.tracks
    }
  },
  actions: {
    AddTrack(track: Track) {
      this.tracks.push(track)
    },
    ClearTracks() {
      this.tracks = []
    },
    SetAnchor(sideIndex: number, trackIndex: number, id: string) {
      const track = this.tracks.find(t => t.id == id)
      if(track) {
        track.anchor = {
          anchored: true,
          side_index: sideIndex,
          track_index: trackIndex
        }
      }
    }
  }
})
