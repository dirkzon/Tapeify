import { beforeEach, describe, expect, expectTypeOf, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAlbumsStore, type Album } from './album'

describe('Albums Tests', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
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
      describe('setAlbums', () => {
        it('setAlbums', () => {
          const albumsStore = useAlbumsStore()
          albumsStore.SetAlbums(spotifyAlbumsResponse['albums'])

          const albums = albumsStore.getAlbums

          expect(albums).toBeDefined()
          expectTypeOf(albums).toEqualTypeOf<Album[]>()
          expect(albums).toEqual([
            {
              name: spotifyAlbumsResponse['albums'][0]['name'],
              id: spotifyAlbumsResponse['albums'][0]['id'],
              artists: ['Daft Punk'],
              image: new URL(spotifyAlbumsResponse['albums'][0]['images'][0]['url'])
            }
          ])
        })
        it('setEmptyAlbums', () => {
          const albumsStore = useAlbumsStore()
          albumsStore.SetAlbums([])

          const albums = albumsStore.getAlbums

          expect(albums).toBeDefined()
          expectTypeOf(albums).toEqualTypeOf<Album[]>()
          expect(albums.length).toEqual(0)
        })
      })
    })
    it('clearAlbums', () => {
      const albumsStore = useAlbumsStore()
      albumsStore.SetAlbums(spotifyAlbumsResponse['albums'])

      albumsStore.ClearAlbums()

      const albums = albumsStore.getAlbums
      expect(albums).toBeDefined()
      expectTypeOf(albums).toEqualTypeOf<Album[]>()
      expect(albums.length).toEqual(0)
    })
  })
})

const spotifyAlbumsResponse = {
  albums: [
    {
      album_type: 'album',
      total_tracks: 15,
      available_markets: [],
      external_urls: {
        spotify: 'https://open.spotify.com/album/382ObEPsp2rxGrnsizN5TX'
      },
      href: 'https://api.spotify.com/v1/albums/382ObEPsp2rxGrnsizN5TX?locale=en-US%2Cen%3Bq%3D0.5',
      id: '382ObEPsp2rxGrnsizN5TX',
      images: [
        {
          url: 'https://i.scdn.co/image/ab67616d0000b27326597c053b38c9cf93f8f3a9',
          height: 640,
          width: 640
        },
        {
          url: 'https://i.scdn.co/image/ab67616d00001e0226597c053b38c9cf93f8f3a9',
          height: 300,
          width: 300
        },
        {
          url: 'https://i.scdn.co/image/ab67616d0000485126597c053b38c9cf93f8f3a9',
          height: 64,
          width: 64
        }
      ],
      name: 'TRON: Legacy Reconfigured',
      release_date: '2011-01-01',
      release_date_precision: 'day',
      type: 'album',
      uri: 'spotify:album:382ObEPsp2rxGrnsizN5TX',
      artists: [
        {
          external_urls: {
            spotify: 'https://open.spotify.com/artist/4tZwfgrHOc3mvqYlEYSvVi'
          },
          href: 'https://api.spotify.com/v1/artists/4tZwfgrHOc3mvqYlEYSvVi',
          id: '4tZwfgrHOc3mvqYlEYSvVi',
          name: 'Daft Punk',
          type: 'artist',
          uri: 'spotify:artist:4tZwfgrHOc3mvqYlEYSvVi'
        }
      ],
      tracks: {
        href: 'https://api.spotify.com/v1/albums/382ObEPsp2rxGrnsizN5TX/tracks?offset=0&limit=50&locale=en-US,en;q%3D0.5',
        limit: 50,
        next: null,
        offset: 0,
        previous: null,
        total: 15,
        items: []
      },
      copyrights: [
        {
          text: '© 2011 Disney',
          type: 'C'
        },
        {
          text: '℗ 2011 Walt Disney Records',
          type: 'P'
        }
      ],
      external_ids: {
        upc: '00050087239633'
      },
      genres: [],
      label: 'Walt Disney Records',
      popularity: 43
    }
  ]
}
