import { beforeEach, describe, expect, it } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { usePaginationStore } from './pagination';

describe('Pagination store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe('initial state', () => {
    it('has expected default values', () => {
      const store = usePaginationStore();
      expect(store.offset).toBe(0);
      expect(store.limit).toBe(10);
      expect(store.nextPageAvailable).toBe(false);
      expect(store.previousPageAvailable).toBe(false);
    });
  });

  describe('actions', () => {
    it('setAvailability toggles next/previous flags', () => {
      const store = usePaginationStore();
      store.setAvailability(true, true);

      expect(store.previousPageAvailable).toBe(true);
      expect(store.nextPageAvailable).toBe(true);

      store.setAvailability(false, false);
      expect(store.previousPageAvailable).toBe(false);
      expect(store.nextPageAvailable).toBe(false);
    });

    describe('setOffset', () => {
      it('sets a non-negative offset', () => {
        const store = usePaginationStore();
        store.setOffset(10);
        expect(store.offset).toBe(10);
      });

      it('prevents negative offsets (clamps to 0)', () => {
        const store = usePaginationStore();
        store.setOffset(-5);
        expect(store.offset).toBe(0);
      });
    });

    it('resetPagination resets offset to 0 (and keeps limit)', () => {
      const store = usePaginationStore();
      store.setOffset(20);
      expect(store.offset).toBe(20);

      store.resetPagination();
      expect(store.offset).toBe(0);
      expect(store.limit).toBe(10);
    });
  });
});
