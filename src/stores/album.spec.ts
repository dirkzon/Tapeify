import { beforeEach, describe, expect, expectTypeOf, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useAlbumsStore } from './album';
import type { Album } from '@/types/tapeify/models';

vi.mock('../router', () => ({ default: { push: vi.fn() } }));

const makeAlbum = (overrides?: Partial<Album>): Album => ({
  name: 'test album',
  id: '1234',
  artists: ['John Doe'],
  image: new URL('https://i.scdn.co/image/ab67616d0000b27326597c053b38c9cf93f8f3a9'),
  ...overrides,
});

describe('Albums store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe('state & types', () => {
    it('initializes with an empty albums array of correct type', () => {
      const store = useAlbumsStore();
      expect(store.albums).toBeDefined();
      expectTypeOf(store.albums).toEqualTypeOf<Album[]>();
      expect(store.albums).toHaveLength(0);
    });
  });

  describe('actions', () => {
    it('adds an album (AddAlbum) and stores correct values', () => {
      const store = useAlbumsStore();
      const album = makeAlbum();
      store.AddAlbum(album);

      expect(store.albums).toHaveLength(1);
      expect(store.albums).toContainEqual(album);

      const stored = store.albums[0];
      expect(stored.name).toBeTypeOf('string');
      expect(stored.id).toBeTypeOf('string');
      expect(stored.artists).toBeInstanceOf(Array);
      expect(stored.artists).toEqual(expect.arrayContaining(['John Doe']));
      expect(stored.image).toBeInstanceOf(URL);
      expect(stored.image).toBeDefined();
      expect(stored.image!.href).toBeTypeOf('string');
    });

    it('clears albums (ClearAlbums) and results in an empty array', () => {
      const store = useAlbumsStore();
      store.AddAlbum(makeAlbum());
      expect(store.albums.length).toBeGreaterThan(0);

      store.ClearAlbums();
      expect(store.albums).toHaveLength(0);
    });
  });
});
