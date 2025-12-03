import { defineStore } from 'pinia'

const STORE_NAME = 'pagination'

export const usePaginationStore = defineStore(STORE_NAME, {
  state: () => ({
    nextPageAvailable: false,
    previousPageAvailable: false,
    limit: 10,
    offset: 0
  }),
  getters: {},
  actions: {
    setAvailability(previous: boolean, next: boolean) {
      this.nextPageAvailable = next
      this.previousPageAvailable = previous
    },
    setOffset(offset: number) {
      if (offset < 0) this.offset = 0
      else this.offset = offset
    },
    setLimit(limit: number) {
      if (limit < 0) this.limit = 0
      else this.limit = limit
    },
    resetPagination() {
      this.offset = 0
    }
  }
})
