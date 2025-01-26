import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { usePaginationStore } from './pagination'

describe('Pagination Tests', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('getters', () => {
    it('getOffset', () => {
      const paginationStore = usePaginationStore()
      const offset = paginationStore.getOffset
      expect(offset).toBeDefined()
      expect(offset).toBe(0)
    })
    it('getLimit', () => {
      const paginationStore = usePaginationStore()
      const limit = paginationStore.getLimit
      expect(limit).toBeDefined()
      expect(limit).toBe(10)
    })
    it('getNextPageAvailable', () => {
      const paginationStore = usePaginationStore()
      const available = paginationStore.getNextPageAvailable
      expect(available).toBeDefined()
      expect(available).toBe(false)
    })
    it('getPreviousPageAvailable', () => {
      const paginationStore = usePaginationStore()
      const available = paginationStore.getPreviousPageAvailable
      expect(available).toBeDefined()
      expect(available).toBe(false)
    })
  })

  describe('actions', () => {
    it('setAvailability', () => {
      const paginationStore = usePaginationStore()
      paginationStore.setAvailability(true, true)

      const previousPageAvailable = paginationStore.getPreviousPageAvailable
      expect(previousPageAvailable).toBeDefined()
      expect(previousPageAvailable).toBe(true)

      const nextPageAvailable = paginationStore.getNextPageAvailable
      expect(nextPageAvailable).toBeDefined()
      expect(nextPageAvailable).toBe(true)
    })
    describe('setOffset', () => {
      it('setOffset', () => {
        const newOffset = 10

        const paginationStore = usePaginationStore()
        paginationStore.setOffset(newOffset)

        const offset = paginationStore.getOffset
        expect(offset).toBeDefined()
        expect(offset).toBe(newOffset)
      })
      it('setNegativeOffset', () => {
        const newOffset = -10

        const paginationStore = usePaginationStore()
        paginationStore.setOffset(newOffset)

        const offset = paginationStore.getOffset
        expect(offset).toBeDefined()
        expect(offset).toBe(0)
      })
    })
    it('resetPagination', () => {
      const paginationStore = usePaginationStore()
      paginationStore.resetPagination()

      const offset = paginationStore.getOffset
      expect(offset).toBeDefined()
      expect(offset).toBe(0)
    })
  })
})
