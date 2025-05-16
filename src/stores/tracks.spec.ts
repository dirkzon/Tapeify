import { setActivePinia, createPinia } from 'pinia'
import { beforeEach, describe, expect, expectTypeOf, it, vi } from 'vitest'
import { UseTracksStore, type Track } from './tracks'

describe('tracks test', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.mock('../router', () => ({
      default: {
        push: vi.fn()
      }
    }))
  })

  describe('getters', () => {
    it('getTracks', () => {
      const tracksStore = UseTracksStore()
      const tracks = tracksStore.getTracks

      expect(tracks).toBeDefined()
      expectTypeOf(tracks).toEqualTypeOf<Track[]>()
    })
    describe('actions', () => {
      it('addTrack', () => {
        const tracksStore = UseTracksStore()
        const tracksBeforeAdding = tracksStore.getTracks
        expect(tracksBeforeAdding).toBeDefined()
        expect(tracksBeforeAdding.length).toBe(0)

        const trackToAdd: Track = {
          name: 'track',
          id: '1234',
          explicit: false,
          duration_ms: 1000,
          artists: ['artist'],
        }
        tracksStore.AddTrack(trackToAdd)

        const tracksAfterAdding = tracksStore.getTracks
        expect(tracksAfterAdding).toBeDefined()
        expect(tracksAfterAdding.length).toBe(1)
        expect(tracksAfterAdding[0]).toStrictEqual(trackToAdd)
      })
      it('clearTracks', () => {
        const tracksStore = UseTracksStore()

        const trackToAdd: Track = {
          name: 'track',
          id: '1234',
          explicit: false,
          duration_ms: 1000,
          artists: ['artist'],
        }
        tracksStore.AddTrack(trackToAdd)

        const tracksBeforeClearing = tracksStore.getTracks
        expect(tracksBeforeClearing).toBeDefined()
        expect(tracksBeforeClearing.length).toBe(1)

        tracksStore.ClearTracks()

        const tracksAfterClearing = tracksStore.getTracks
        expect(tracksAfterClearing).toBeDefined()
        expect(tracksAfterClearing.length).toBe(0)
      })
    })
  })
})
