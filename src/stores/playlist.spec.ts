import { setActivePinia, createPinia } from 'pinia'
import { beforeEach, describe, expect, expectTypeOf, it, vi } from 'vitest'
import { usePlaylistsStore, type Playlist } from './playlists'
import { fetchWrapper } from '@/helpers/fetchWrapper'
import { usePaginationStore } from './pagination'

describe('Playlist Tests', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.mock('../router', () => ({
      default: {
        push: vi.fn()
      }
    }))
  })

  describe('getters', () => {
    it('getPlaylists', () => {
      const playlistsStore = usePlaylistsStore()
      const playlists = playlistsStore.getPlaylists

      expect(playlists).toBeDefined()
      expectTypeOf(playlists).toEqualTypeOf<Playlist[]>()
    })
  })
  describe('actions', () => {
    it('AddPlaylist', () => {
      const playlistsStore = usePlaylistsStore()
      const playlistToAdd: Playlist = {
        name: 'my playlist',
        owner: 'John Doe',
        id: '12345',
        image: new URL(
          'https://mosaic.scdn.co/60/ab67616d00001e022910c6fc625b0d5ae2eed26aab67616d00001e023dc315e27e5cae6e5519823aab67616d00001e02d272c37389bd3d9c20564166ab67616d00001e02d5bb99cd52da195675b2f2cd'
        )
      }

      playlistsStore.AddPlaylist(playlistToAdd)

      const playlists = playlistsStore.getPlaylists
      expect(playlists).toBeDefined()
      expectTypeOf(playlists).toEqualTypeOf<Playlist[]>()
      for (const playlist of playlists) {
        expect(playlist.name).toBeTypeOf('string')
        expect(playlist.id).toBeTypeOf('string')
        expect(playlist.owner).toBeTypeOf('string')
        if (playlist.image) {
          expect(playlist.image.href).toBeTypeOf('string')
        }
      }
      expect(playlists).toContainEqual(playlistToAdd)
    })

    it('clearPlaylists', () => {
      const playlistsStore = usePlaylistsStore()
      const playlistToAdd: Playlist = {
        name: 'my playlist',
        owner: 'John Doe',
        id: '12345',
        image: new URL(
          'https://mosaic.scdn.co/60/ab67616d00001e022910c6fc625b0d5ae2eed26aab67616d00001e023dc315e27e5cae6e5519823aab67616d00001e02d272c37389bd3d9c20564166ab67616d00001e02d5bb99cd52da195675b2f2cd'
        )
      }

      playlistsStore.AddPlaylist(playlistToAdd)

      playlistsStore.ClearPlaylists()

      const albums = playlistsStore.getPlaylists
      expect(albums).toBeDefined()
      expectTypeOf(albums).toEqualTypeOf<Playlist[]>()
      expect(albums.length).toEqual(0)
    })
    describe('FetchUsersPlayists', () => {
      it('FetchUsersPlayists', async () => {
        fetchWrapper.get = vi.fn().mockResolvedValue(spotifyPlaylistsResponse)

        const playlistsStore = usePlaylistsStore()
        await playlistsStore.FetchUsersPlayists()

        const playlists = playlistsStore.getPlaylists

        expect(playlists).toBeDefined()
        expectTypeOf(playlists).toEqualTypeOf<Playlist[]>()
        expect(playlists[0].id).toEqual(spotifyPlaylistsResponse['items'][0]['id'])
        expect(playlists[0].name).toEqual(spotifyPlaylistsResponse['items'][0]['name'])
        expect(playlists[0].owner).toEqual(
          spotifyPlaylistsResponse['items'][0]['owner']['display_name']
        )
        if (playlists[0].image) {
          expect(playlists[0].image.href).toEqual(
            'https://mosaic.scdn.co/60/ab67616d00001e022910c6fc625b0d5ae2eed26aab67616d00001e023dc315e27e5cae6e5519823aab67616d00001e02d272c37389bd3d9c20564166ab67616d00001e02d5bb99cd52da195675b2f2cd'
          )
        }

        expect(playlists[1].id).toEqual(spotifyPlaylistsResponse['items'][1]['id'])
        expect(playlists[1].name).toEqual(spotifyPlaylistsResponse['items'][1]['name'])
        expect(playlists[1].owner).toEqual(
          spotifyPlaylistsResponse['items'][1]['owner']['display_name']
        )
        if (playlists[1].image) {
          expect(playlists[1].image.href).toEqual(
            spotifyPlaylistsResponse['items'][1]['images'][0]['url']
          )
        }

        const paginationStore = usePaginationStore()
        expect(paginationStore.getNextPageAvailable).toBe(true)
        expect(paginationStore.getPreviousPageAvailable).toBe(false)
      })
      describe('FetchUsersPlayists with invalid limit', async () => {
        it('limit too high', async () => {
          const paginationStore = usePaginationStore()
          paginationStore.limit = 10000

          const playlistsStore = usePlaylistsStore()
          await expect(() => playlistsStore.FetchUsersPlayists()).rejects.toThrowError(
            'Limit out of bounds'
          )
        })
        it('limit too low', async () => {
          const paginationStore = usePaginationStore()
          paginationStore.limit = 0

          const playlistsStore = usePlaylistsStore()
          await expect(() => playlistsStore.FetchUsersPlayists()).rejects.toThrowError(
            'Limit out of bounds'
          )
        })
      })
      describe('FetchUsersPlayists with invalid offset', async () => {
        it('offset too high', async () => {
          const paginationStore = usePaginationStore()
          paginationStore.offset = 100000

          const playlistsStore = usePlaylistsStore()
          await expect(() => playlistsStore.FetchUsersPlayists()).rejects.toThrowError(
            'Offset out of bounds'
          )
        })
        it('offset too low', async () => {
          const paginationStore = usePaginationStore()
          paginationStore.offset = -1

          const playlistsStore = usePlaylistsStore()
          await expect(() => playlistsStore.FetchUsersPlayists()).rejects.toThrowError(
            'Offset out of bounds'
          )
        })
      })
    })
  })
})

const spotifyPlaylistsResponse = {
  href: 'https://api.spotify.com/v1/users/smedjan/playlists?offset=0&limit=2&locale=en-US,en;q%3D0.5',
  limit: 2,
  next: 'https://api.spotify.com/v1/users/smedjan/playlists?offset=2&limit=2&locale=en-US,en;q%3D0.5',
  offset: 0,
  previous: null,
  total: 98,
  items: [
    {
      collaborative: false,
      description: '',
      external_urls: {
        spotify: 'https://open.spotify.com/playlist/1CBGDKGM8kekBPfAG5jPZt'
      },
      href: 'https://api.spotify.com/v1/playlists/1CBGDKGM8kekBPfAG5jPZt',
      id: '1CBGDKGM8kekBPfAG5jPZt',
      images: [
        {
          height: 640,
          url: 'https://mosaic.scdn.co/640/ab67616d00001e022910c6fc625b0d5ae2eed26aab67616d00001e023dc315e27e5cae6e5519823aab67616d00001e02d272c37389bd3d9c20564166ab67616d00001e02d5bb99cd52da195675b2f2cd',
          width: 640
        },
        {
          height: 300,
          url: 'https://mosaic.scdn.co/300/ab67616d00001e022910c6fc625b0d5ae2eed26aab67616d00001e023dc315e27e5cae6e5519823aab67616d00001e02d272c37389bd3d9c20564166ab67616d00001e02d5bb99cd52da195675b2f2cd',
          width: 300
        },
        {
          height: 60,
          url: 'https://mosaic.scdn.co/60/ab67616d00001e022910c6fc625b0d5ae2eed26aab67616d00001e023dc315e27e5cae6e5519823aab67616d00001e02d272c37389bd3d9c20564166ab67616d00001e02d5bb99cd52da195675b2f2cd',
          width: 60
        }
      ],
      name: 'Starred',
      owner: {
        display_name: 'smedjan',
        external_urls: {
          spotify: 'https://open.spotify.com/user/smedjan'
        },
        href: 'https://api.spotify.com/v1/users/smedjan',
        id: 'smedjan',
        type: 'user',
        uri: 'spotify:user:smedjan'
      },
      primary_color: null,
      public: true,
      snapshot_id: 'AAAABEP1mXdhPfoWmcM1L+GcTwxB8crh',
      tracks: {
        href: 'https://api.spotify.com/v1/playlists/1CBGDKGM8kekBPfAG5jPZt/tracks',
        total: 118
      },
      type: 'playlist',
      uri: 'spotify:playlist:1CBGDKGM8kekBPfAG5jPZt'
    },
    {
      collaborative: false,
      description:
        'A mish mash of a bunch of songs that you can maybe dance to. Curated by <a href="https://twitter.com/nicktoumpelis">Nick Toumpelis</a>. Photography by <a href="https://www.instagram.com/nicktoumpelis/">Nick Toumpelis</a>. ',
      external_urls: {
        spotify: 'https://open.spotify.com/playlist/3tT3E3Q4u5Xd0v3ySPLR1O'
      },
      href: 'https://api.spotify.com/v1/playlists/3tT3E3Q4u5Xd0v3ySPLR1O',
      id: '3tT3E3Q4u5Xd0v3ySPLR1O',
      images: [
        {
          height: null,
          url: 'https://image-cdn-ak.spotifycdn.com/image/ab67706c0000da84f8496493a06aec2c3eda1a42',
          width: null
        }
      ],
      name: 'dance fusion',
      owner: {
        display_name: 'Nick Toumpelis',
        external_urls: {
          spotify: 'https://open.spotify.com/user/1226836970'
        },
        href: 'https://api.spotify.com/v1/users/1226836970',
        id: '1226836970',
        type: 'user',
        uri: 'spotify:user:1226836970'
      },
      primary_color: null,
      public: true,
      snapshot_id: 'AAAN3eephAMj/tM4sCQtXXGRL39TnfyI',
      tracks: {
        href: 'https://api.spotify.com/v1/playlists/3tT3E3Q4u5Xd0v3ySPLR1O/tracks',
        total: 22
      },
      type: 'playlist',
      uri: 'spotify:playlist:3tT3E3Q4u5Xd0v3ySPLR1O'
    }
  ]
}
