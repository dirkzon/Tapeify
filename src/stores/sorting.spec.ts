import { setActivePinia, createPinia } from 'pinia'
import { beforeEach, describe, expect, it, test, vi } from 'vitest'
import { useSortingStore } from './sorting'
import { SortType } from '@/utils/sorting/trackSorter'

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
        expect(Object.keys(SortType).includes(type.toString())).toBeTruthy()
      }
    })
  })
  describe('actions', () => {
    test.todo('Will be implemented once sorting is fully implemented.')
  })
})
