// @vitest-environment happy-dom

import { UseSearchStore } from './search'
import { fetchWrapper } from '@/utils/fetchwrapper/fetchWrapper'
import { setActivePinia, createPinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { usePaginationStore } from './pagination'
import { usePlaylistsStore } from './playlists'
import { useAlbumsStore } from './album'
import type { Profile } from '@/types/tapeify/models'

describe('Search tests', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.mock('../router', () => ({
      default: {
        push: vi.fn()
      }
    }))

    fetchWrapper.get = vi.fn().mockResolvedValue(spotifySearchResults)
  })

  describe('actions', () => {
    describe('SearchPlaylistsAndAlbums', () => {
      it('correct search params', async () => {
        const profile: Profile = {
          id: 'user_id',
          displayName: 'User Name',
          type: 'user',
          uri: 'spotify:user:user_id',
          country: 'NL',
        }

        localStorage.setItem('profile', JSON.stringify(profile))

        const searchStore = UseSearchStore()

        await searchStore.SearchPlaylistsAndAlbums('query')

        const fetchWrapperSpy = vi.spyOn(fetchWrapper, 'get')

        expect(fetchWrapperSpy).toBeCalled()
        expect(fetchWrapperSpy.mock.calls[0][0].searchParams.get('market')).toStrictEqual(
          expect.any(String)
        )
        expect(fetchWrapperSpy.mock.calls[0][0].searchParams.get('type')).toStrictEqual(
          expect.any(String)
        )
        expect(fetchWrapperSpy.mock.calls[0][0].searchParams.get('q')).toStrictEqual(
          expect.any(String)
        )
      })
      it('limit too high', async () => {
        const searchStore = UseSearchStore()

        const paginationStore = usePaginationStore()
        paginationStore.limit = 10000

        await expect(() => searchStore.SearchPlaylistsAndAlbums('query')).rejects.toThrowError(
          'Limit out of bounds'
        )
      })
      it('limit too low', async () => {
        const searchStore = UseSearchStore()

        const paginationStore = usePaginationStore()
        paginationStore.limit = 0

        await expect(() => searchStore.SearchPlaylistsAndAlbums('query')).rejects.toThrowError(
          'Limit out of bounds'
        )
      })
      it('offset too high', async () => {
        const searchStore = UseSearchStore()

        const paginationStore = usePaginationStore()
        paginationStore.offset = 10000

        await expect(() => searchStore.SearchPlaylistsAndAlbums('query')).rejects.toThrowError(
          'Offset out of bounds'
        )
      })
      it('offset too low', async () => {
        const searchStore = UseSearchStore()

        const paginationStore = usePaginationStore()
        paginationStore.offset = -1

        await expect(() => searchStore.SearchPlaylistsAndAlbums('query')).rejects.toThrowError(
          'Offset out of bounds'
        )
      })
      it('Set playlists', async () => {
        const searchStore = UseSearchStore()

        await searchStore.SearchPlaylistsAndAlbums('query')

        const playlistsStore = usePlaylistsStore()
        expect(playlistsStore.getPlaylists.length).toBeGreaterThanOrEqual(1)
      })
      it('Set albums', async () => {
        const searchStore = UseSearchStore()

        await searchStore.SearchPlaylistsAndAlbums('query')

        const albumsStore = useAlbumsStore()
        expect(albumsStore.getAlbums.length).toBeGreaterThanOrEqual(2)
      })
      it('Set pagination', async () => {
        const searchStore = UseSearchStore()

        await searchStore.SearchPlaylistsAndAlbums('query')

        const paginationStore = usePaginationStore()
        expect(paginationStore.getNextPageAvailable).toBeTruthy()
        expect(paginationStore.getPreviousPageAvailable).toBeFalsy()
      })
    })
  })
})

const spotifySearchResults = {
  albums: {
    href: 'https://api.spotify.com/v1/search?offset=0&limit=2&query=remaster%2520track%3ADoxy%2520artist%3AMiles%2520Davis&type=album&locale=en-US,en;q%3D0.5',
    limit: 2,
    next: 'https://api.spotify.com/v1/search?offset=2&limit=2&query=remaster%2520track%3ADoxy%2520artist%3AMiles%2520Davis&type=album&locale=en-US,en;q%3D0.5',
    offset: 0,
    previous: null,
    total: 800,
    items: [
      {
        album_type: 'album',
        total_tracks: 27,
        available_markets: [],
        external_urls: {
          spotify: 'https://open.spotify.com/album/0aoOdlpGLfNCUFhQu7UIs2'
        },
        href: 'https://api.spotify.com/v1/albums/0aoOdlpGLfNCUFhQu7UIs2',
        id: '0aoOdlpGLfNCUFhQu7UIs2',
        images: [
          {
            height: 640,
            url: 'https://i.scdn.co/image/ab67616d0000b2733d8e4b5eb0aa2a22188fef7e',
            width: 640
          },
          {
            height: 300,
            url: 'https://i.scdn.co/image/ab67616d00001e023d8e4b5eb0aa2a22188fef7e',
            width: 300
          },
          {
            height: 64,
            url: 'https://i.scdn.co/image/ab67616d000048513d8e4b5eb0aa2a22188fef7e',
            width: 64
          }
        ],
        name: "Ascenseur pour l'échafaud",
        release_date: '1958-01-29',
        release_date_precision: 'day',
        type: 'album',
        uri: 'spotify:album:0aoOdlpGLfNCUFhQu7UIs2',
        artists: [
          {
            external_urls: {
              spotify: 'https://open.spotify.com/artist/0kbYTNQb4Pb1rPbbaF0pT4'
            },
            href: 'https://api.spotify.com/v1/artists/0kbYTNQb4Pb1rPbbaF0pT4',
            id: '0kbYTNQb4Pb1rPbbaF0pT4',
            name: 'Miles Davis',
            type: 'artist',
            uri: 'spotify:artist:0kbYTNQb4Pb1rPbbaF0pT4'
          }
        ]
      },
      {
        album_type: 'album',
        total_tracks: 21,
        available_markets: [],
        external_urls: {
          spotify: 'https://open.spotify.com/album/4sb0eMpDn3upAFfyi4q2rw'
        },
        href: 'https://api.spotify.com/v1/albums/4sb0eMpDn3upAFfyi4q2rw',
        id: '4sb0eMpDn3upAFfyi4q2rw',
        images: [
          {
            height: 640,
            url: 'https://i.scdn.co/image/ab67616d0000b2730ebc17239b6b18ba88cfb8ca',
            width: 640
          },
          {
            height: 300,
            url: 'https://i.scdn.co/image/ab67616d00001e020ebc17239b6b18ba88cfb8ca',
            width: 300
          },
          {
            height: 64,
            url: 'https://i.scdn.co/image/ab67616d000048510ebc17239b6b18ba88cfb8ca',
            width: 64
          }
        ],
        name: 'Kind Of Blue (Legacy Edition)',
        release_date: '1959-08-17',
        release_date_precision: 'day',
        type: 'album',
        uri: 'spotify:album:4sb0eMpDn3upAFfyi4q2rw',
        artists: [
          {
            external_urls: {
              spotify: 'https://open.spotify.com/artist/0kbYTNQb4Pb1rPbbaF0pT4'
            },
            href: 'https://api.spotify.com/v1/artists/0kbYTNQb4Pb1rPbbaF0pT4',
            id: '0kbYTNQb4Pb1rPbbaF0pT4',
            name: 'Miles Davis',
            type: 'artist',
            uri: 'spotify:artist:0kbYTNQb4Pb1rPbbaF0pT4'
          }
        ]
      }
    ]
  },
  playlists: {
    href: 'https://api.spotify.com/v1/search?offset=0&limit=2&query=remaster%2520track%3ADoxy%2520artist%3AMiles%2520Davis&type=playlist&locale=en-US,en;q%3D0.5',
    limit: 2,
    next: 'https://api.spotify.com/v1/search?offset=2&limit=2&query=remaster%2520track%3ADoxy%2520artist%3AMiles%2520Davis&type=playlist&locale=en-US,en;q%3D0.5',
    offset: 0,
    previous: null,
    total: 800,
    items: [
      {
        collaborative: false,
        description:
          'Miles Davis Best Of - Trumpet Player - Jazz - Blues - Cool Jazz - Musician - Майлз Дэвис Лучший из - трубач - ベストオブマイルスデイビス-トランペット奏者',
        external_urls: {
          spotify: 'https://open.spotify.com/playlist/7s3j2kN6vl2xNMTa8LGLrM'
        },
        href: 'https://api.spotify.com/v1/playlists/7s3j2kN6vl2xNMTa8LGLrM',
        id: '7s3j2kN6vl2xNMTa8LGLrM',
        images: [
          {
            height: null,
            url: 'https://image-cdn-ak.spotifycdn.com/image/ab67706c0000da84e3860dd69b8e6236b985c4b5',
            width: null
          }
        ],
        name: 'Miles Davis Best Of',
        owner: {
          display_name: 'Hangout',
          external_urls: {
            spotify: 'https://open.spotify.com/user/ei3jiodwr0krafh75vu7m8l1m'
          },
          href: 'https://api.spotify.com/v1/users/ei3jiodwr0krafh75vu7m8l1m',
          id: 'ei3jiodwr0krafh75vu7m8l1m',
          type: 'user',
          uri: 'spotify:user:ei3jiodwr0krafh75vu7m8l1m'
        },
        primary_color: null,
        public: true,
        snapshot_id: 'AAAA/4cIHUBdFa7KGxFxc4I23zhYAVX2',
        tracks: {
          href: 'https://api.spotify.com/v1/playlists/7s3j2kN6vl2xNMTa8LGLrM/tracks',
          total: 44
        },
        type: 'playlist',
        uri: 'spotify:playlist:7s3j2kN6vl2xNMTa8LGLrM'
      },
      null
    ]
  }
}
