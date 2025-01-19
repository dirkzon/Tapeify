import { fetchWrapper } from '@/helpers/fetchWrapper'
import { defineStore } from 'pinia'

const STORE_NAME = 'profile'

export const useProfileStore = defineStore(STORE_NAME, {
  persist: true,
  state: () => ({
    name: '',
    id: ''
  }),
  getters: {
    getUser: (state) => {
      return {
        name: state.name,
        id: state.id
      }
    }
  },
  actions: {
    async getProfile() {
      const url = new URL(import.meta.env.VITE_SPOTIFY_ENDPOINT + '/me')
      const { display_name, id } = await fetchWrapper.get(url)
      this.name = display_name
      this.id = id
    }
  },
})
