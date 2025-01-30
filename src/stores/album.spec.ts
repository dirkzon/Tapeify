import { beforeEach, describe, expect, expectTypeOf, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAlbumsStore, type Album } from './album'

describe('Albums Tests', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.mock('../router', () => ({
      default: {
        push: vi.fn()
      }
    }))
  })

  describe('getters', () => {
    describe('getAlbums', () => {
      it('getEmtpyAlbums', () => {
        const albumsStore = useAlbumsStore()
        const albums = albumsStore.getAlbums

        expect(albums).toBeDefined()
        expectTypeOf(albums).toEqualTypeOf<Album[]>()
      })
    })
    describe('actions', () => {
      it('setAlbums', () => {
        const albumsStore = useAlbumsStore()
        const albumToAdd: Album = {
          name: 'test album',
          id: '1234',
          artists: ['John Doe'],
          image: new URL('https://i.scdn.co/image/ab67616d0000b27326597c053b38c9cf93f8f3a9')
        }
        albumsStore.AddAlbum(albumToAdd)

        const albums = albumsStore.getAlbums

        expect(albums).toBeDefined()
        expectTypeOf(albums).toEqualTypeOf<Album[]>()
        for (const album of albums) {
          expect(album.name).toBeTypeOf('string')
          expect(album.id).toBeTypeOf('string')
          for (const artist of album.artists) {
            expect(artist).toBeTypeOf('string')
          }
          expect(album.image.href).toBeTypeOf('string')
        }
        expect(albums).toContainEqual(albumToAdd)
      })
    })
    it('clearAlbums', () => {
      const albumsStore = useAlbumsStore()
      const albumToAdd: Album = {
        name: 'test album',
        id: '1234',
        artists: ['John Doe'],
        image: new URL('https://i.scdn.co/image/ab67616d0000b27326597c053b38c9cf93f8f3a9')
      }
      albumsStore.AddAlbum(albumToAdd)

      albumsStore.ClearAlbums()

      const albums = albumsStore.getAlbums
      expect(albums).toBeDefined()
      expectTypeOf(albums).toEqualTypeOf<Album[]>()
      expect(albums.length).toEqual(0)
    })
  })
})
