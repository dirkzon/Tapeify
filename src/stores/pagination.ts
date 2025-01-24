import { defineStore } from 'pinia'

const STORE_NAME = 'pagination'

export const usePaginationStore = defineStore(STORE_NAME, {
  persist: false,
  state: () => ({
    nextPageAvailable: true,
    previousPageAvailable: false,
    limit: 10,
    offset: 0
  }),
  actions: {
    setAvailability(previous: boolean, next: boolean) {
      this.nextPageAvailable = next
      this.previousPageAvailable = previous
    },
    setOffset(offset: number) {
      if (offset < 0) this.offset = 0
      this.offset = offset
    }
  }
})