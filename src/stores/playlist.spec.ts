import { beforeEach, describe, expect, it, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { usePlaylistsStore } from './playlists';
import { usePaginationStore } from './pagination';
import type { Playlist } from '@/types/tapeify/models';
import { apiClient } from '@/api/clients';

vi.mock('../router', () => ({ default: { push: vi.fn() } }));
vi.mock('@/api/clients');

const makePlaylistModel = (overrides?: Partial<Playlist>): Playlist => ({
  id: '12345',
  name: 'my playlist',
  owner: 'John Doe',
  image: new URL('https://example.com/image.jpg'),
  ...overrides,
});

const spotifyPlaylistsResponse = {
  limit: 2,
  next: 'https://api.spotify.com/next',
  previous: null,
  offset: 0,
  total: 98,
  items: [
    { id: 'p1', name: 'one', owner: { display_name: 'owner1' }, images: [{ url: 'https://img/1' }] },
    { id: 'p2', name: 'two', owner: { display_name: 'owner2' }, images: [{ url: 'https://img/2' }] }
  ]
};

const playlistDetailResponse = {
  id: 'p1',
  name: 'one',
  tracks: { limit: 2, total: 3, offset: 0 }
};

const playlistTracksPage1 = {
  items: [
    { track: { type: 'track', id: 't1', name: 'Track 1' } },
    { track: { type: 'episode', id: 'e1', name: 'Episode 1' } }
  ]
};
const playlistTracksPage2 = {
  items: [
    { track: { type: 'track', id: 't2', name: 'Track 2' } }
  ]
};

describe('Playlists store (apiClient mocked)', () => {
  let mockedGet: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    setActivePinia(createPinia());

    vi.resetAllMocks();
    mockedGet = vi.spyOn(apiClient as any, 'get');
  });

  it('initial state & Add/Clear behave correctly', () => {
    const store = usePlaylistsStore();
    expect(store.getPlaylists).toHaveLength(0);

    const p = makePlaylistModel();
    store.AddPlaylist(p);
    expect(store.getPlaylists).toContainEqual(p);

    store.ClearPlaylists();
    expect(store.getPlaylists).toHaveLength(0);
  });

  it('FetchUsersPlayists maps apiClient response into playlists and updates pagination', async () => {
    mockedGet.mockResolvedValueOnce({ data: spotifyPlaylistsResponse });

    const store = usePlaylistsStore();
    const pagination = usePaginationStore();

    await store.FetchUsersPlayists();

    expect(mockedGet).toHaveBeenCalledWith('/me/playlists', expect.objectContaining({
      params: expect.objectContaining({ limit: pagination.limit, offset: pagination.offset })
    }));

    const playlists = store.getPlaylists;
    expect(playlists).toHaveLength(2);
    expect(playlists[0].id).toBe(spotifyPlaylistsResponse.items[0].id);
    expect(playlists[0].name).toBe(spotifyPlaylistsResponse.items[0].name);
    expect(playlists[0].owner).toBe(spotifyPlaylistsResponse.items[0].owner.display_name);

    expect(pagination.nextPageAvailable).toBe(true);
    expect(pagination.previousPageAvailable).toBe(false);
  });

  it('FetchUsersPlayists rejects when limit/offset out of bounds', async () => {
    const store = usePlaylistsStore();
    const pagination = usePaginationStore();

    pagination.limit = 1000;
    await expect(store.FetchUsersPlayists()).rejects.toThrow('Limit out of bounds');

    pagination.limit = 10;
    pagination.offset = -1;
    await expect(store.FetchUsersPlayists()).rejects.toThrow('Offset out of bounds');
  });
});
