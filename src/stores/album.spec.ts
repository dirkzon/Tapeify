import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { apiClient } from '@/api/clients';
import type { GetAlbumResponse, GetAlbumTracksResponse } from '@/types/spotify/responses';
import { useAlbumsStore } from './album';

const mockGetAlbumResponse: GetAlbumResponse = {
  tracks: {
    items: [],
    next: '',
    previous: '',
    limit: 10,
    offset: 0,
    total: 18
  },
  type: 'album',
  album_type: 'album',
  total_tracks: 0,
  id: '2up3OPMp9Tb4dAKM2erWXQ',
  images: [
    {
      url: 'https://i.scdn.co/image/ab67616d0000b2732c5b24ecfa39523a75c993c4',
      height: 640,
      width: 640
    }
  ],
  name: 'Global Warming',
  uri: 'spotify:album:4aawyAB9vmqN3uQ7FjRGTy',
  artists: [
    {
      type: 'artist',
      id: '0TnOYISbd1XYRBk9myaseg',
      name: 'Pitbull',
      external_urls: {
        spotify: 'https://open.spotify.com/artist/0TnOYISbd1XYRBk9myaseg'
      }
    }
  ],
  external_urls: {
    spotify: ''
  }
}

const mockGetAlbumTracksResponse: GetAlbumTracksResponse = {
  items: [
    {
      type: 'track',
      id: '6habFhsOp2NvshLv26DqMb',
      name: 'Global Warming (feat. Sensato del Patio)',
      uri: 'spotify:track:6habFhsOp2NvshLv26DqMb',
      artists: [
        {
          type: 'artist',
          id: '0TnOYISbd1XYRBk9myaseg',
          name: 'Pitbull',
          external_urls: {
            spotify: 'https://open.spotify.com/artist/0TnOYISbd1XYRBk9myaseg'
          }
        }
      ],
      duration_ms: 231733,
      explicit: false
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

describe('Albums store', () => {
  const getSpy = vi.spyOn(apiClient, 'get');

  beforeEach(() => {
    setActivePinia(createPinia());

    vi.mocked(apiClient.get).mockImplementation((url: string, config?) => {
      console.log(url)
      if (url === '/albums/2up3OPMp9Tb4dAKM2erWXQ') {
        return Promise.resolve({ data: mockGetAlbumResponse });
      }
      if (url === '/albums/2up3OPMp9Tb4dAKM2erWXQ/tracks') {
        return Promise.resolve({ data: mockGetAlbumTracksResponse });
      }
      return Promise.reject('Failed to match mock implementation');
    })
  });

  describe('FetchAlbumTracks', () => {
    it('fetches the album', async () => {
      const albumsStore = useAlbumsStore();

      await albumsStore.FetchAlbumTracks('2up3OPMp9Tb4dAKM2erWXQ');

      expect(getSpy).toHaveBeenCalledWith('/albums/2up3OPMp9Tb4dAKM2erWXQ');
      expect(getSpy).toHaveBeenCalledWith('/albums/2up3OPMp9Tb4dAKM2erWXQ/tracks', {
        params: {
          limit: 10,
          offset: 0,
        },
      });
      expect(getSpy).toHaveBeenCalledWith('/albums/2up3OPMp9Tb4dAKM2erWXQ/tracks', {
        params: {
          limit: 10,
          offset: 10,
        },
      });
    });
  });
});
