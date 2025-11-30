import { setActivePinia, createPinia } from 'pinia'
import { beforeEach, describe, expect, it, test, vi } from 'vitest'
import { useSortingStore } from './sorting'

describe('sorting store tests', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.mock('../router', () => ({
      default: {
        push: vi.fn()
      }
    }))
  })
  describe('actions', () => {
    test.todo('Will be implemented once sorting is fully implemented.')
  })
})
