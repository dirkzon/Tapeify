import { defineStore } from 'pinia'

const STORE_NAME = 'tracks'

interface Anchor {
  side_index: number
  track_index: number
}

export interface Track {
  name: string
  id: string
  uri: string,
  image?: URL
  explicit: boolean
  duration_ms: number
  artists: string[]
  anchor?: Anchor
  anchored: boolean
}

export const UseTracksStore = defineStore(STORE_NAME, {
  state: () => ({
    tracks: [] as Track[]
  }),
  getters: {
    getTracks(state): Track[] {
      return state.tracks
    },
    anchoredTracks(state): Track[] {
      return state.tracks.filter((track) => track.anchored)

    },
    unanchoredTracks(state): Track[] {
      return state.tracks.filter((track) => !track.anchored)
    }
  },
  actions: {
    AddTrack(track: Track) {
      this.tracks.push(track)
    },
    ClearTracks() {
      this.tracks = []
    },
    AnchorTrack(side_index: number, track_index: number, id: string) {
      const track = this.tracks.find(t => t.id == id)
      if(track) {
        track.anchored = true
        track.anchor = {
          side_index: side_index,
          track_index: track_index
        }
      }
    },
    UnAnchorTrack(id: string) {
      const track = this.tracks.find(t => t.id == id)
      if(track) {
        track.anchored = false
        track.anchor = undefined
      }
    }
  }
})
