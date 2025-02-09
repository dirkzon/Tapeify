import { setActivePinia, createPinia } from 'pinia'
import { beforeEach, describe, expect, it, test, vi } from 'vitest'
import { useSortingStore } from './sorting'
import { SortType } from '@/helpers/sorting/trackSortInterface'

describe('sorting store tests', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.mock('../router', () => ({
      default: {
        push: vi.fn()
      }
    }))
  })

  describe('getters', () => {
    it('getSortingTypes', () => {
      const sortingStore = useSortingStore()
      const sortingTypes = sortingStore.getSortingTypes

      expect(sortingTypes).toBeDefined()
      for (const type of sortingTypes) {
        expect(Object.values(SortType).includes(type)).toBeTruthy()
      }
    })
  })
  describe('actions', () => {
    test.todo('Will be implemented once sorting is fully implemented.')
  })
})
