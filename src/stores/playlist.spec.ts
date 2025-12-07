import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { apiClient } from '@/api/clients';
import type { GetPlaylistsResponse, GetPlaylistTracksResponse, UsersPlaylistsResponse } from '@/types/spotify/responses';
import { usePlaylistsStore } from './playlists';

const mockGetUserPlaylistsResponse: UsersPlaylistsResponse = {
  items: [],
  next: '',
  previous: '',
  limit: 10,
  offset: 0,
  total: 18
}

const mockGetPlaylistResponse: GetPlaylistsResponse = {
  tracks: {
    items: [],
    next: '',
    previous: '',
    limit: 10,
    offset: 0,
    total: 18
  },
  id: '3cEYpjA9oz9GiPac4AsH4n',
  name: 'Today\'s Top Hits',
  images: [
    {
      url: 'https://i.scdn.co/image/ab67616d0000b2732c5b24ecfa39523a75c993c4',
      height: 640,
      width: 640
    }
  ],
  owner: {
    id: 'spotify',
    display_name: 'Spotify'
  },
  collaborative: false,
  href: ''
}

const mockGetPlaylistTracksResponse: GetPlaylistTracksResponse = {
  items: [
    {
      added_by: {
        id: 'spotify',
        display_name: 'Spotify'
      },
      track: {
        type: 'track',
        id: '6habFhsOp2NvshLv26DqMb',
        name: 'Blinding Lights',
        uri: 'spotify:track:6habFhsOp2NvshLv26DqMb',
        artists: [
          {
            type: 'artist',
            id: '0TnOYISbd1XYRBk9myaseg',
            name: 'The Weeknd'
          }
        ],
        duration_ms: 231733,
        explicit: false,
        album: {
          type: 'album',
          album_type: 'album',
          total_tracks: 0,
          id: '4aawyAB9vmqN3uQ7FjRGTy',
          images: [],
          name: 'After Hours',
          uri: 'spotify:album:4aawyAB9vmqN3uQ7FjRGTy',
          artists: []
        }
      }
    }
  ],
  next: '',
  previous: '',
  limit: 0,
  offset: 0,
  total: 0
}

vi.mock('@/api/clients');
vi.mock('../router', () => ({
  default: { push: vi.fn() }
}));

describe('Playlist store', () => {
  const getSpy = vi.spyOn(apiClient, 'get');

  beforeEach(() => {
    setActivePinia(createPinia());

    vi.mocked(apiClient.get).mockImplementation((url: string, config?) => {
      console.log(url)
      if (url === "/me/playlists") {
        return Promise.resolve({ data: mockGetUserPlaylistsResponse });
      }
      if (url === '/playlists/3cEYpjA9oz9GiPac4AsH4n') {
        return Promise.resolve({ data: mockGetPlaylistResponse });
      }
      if  (url === '/playlists/3cEYpjA9oz9GiPac4AsH4n/tracks') {
        return Promise.resolve({ data: mockGetPlaylistTracksResponse });
      }
      return Promise.reject('Failed to match mock implementation');
    })
  });

  describe('FetchAlbumTracks', () => {
    it('fetches users playlists', async () => {
      const playlistSTore = usePlaylistsStore();

      await playlistSTore.FetchUsersPlayists(10, 0);

      expect(getSpy).toHaveBeenCalledWith('/me/playlists', {
        params: {
          limit: 10,
          offset: 0,
        },
      });
    });
  });
  describe('FetchAlbumTracks', () => {
    it('fetches the album', async () => {
      const albumsStore = usePlaylistsStore();

      await albumsStore.FetchPlaylistTracks('3cEYpjA9oz9GiPac4AsH4n');

      expect(getSpy).toHaveBeenCalledWith('/playlists/3cEYpjA9oz9GiPac4AsH4n');
      expect(getSpy).toHaveBeenCalledWith('/playlists/3cEYpjA9oz9GiPac4AsH4n/tracks', {
        params: {
          limit: 10,
          offset: 0,
        },
      });
      expect(getSpy).toHaveBeenCalledWith('/playlists/3cEYpjA9oz9GiPac4AsH4n/tracks', {
        params: {
          limit: 10,
          offset: 10,
        },
      });
    });
  })
});
