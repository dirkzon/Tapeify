import { ParseProfileDTO } from '@/parsers/profileDtoParser'
import type { GetProfileResponse } from '@/types/spotify/responses'
import { fetchWrapper } from '@/utils/fetchwrapper/fetchWrapper'
import { defineStore } from 'pinia'

const STORE_NAME = 'profile'
const LOCAL_STORAGE_ITEM_NAME = 'profile'

export interface Profile {
  type: string
  image?: URL
  uri: string
  id: string
  display_name: string
  country: string
}

export const useProfileStore = defineStore(STORE_NAME, {
  getters: {
    getProfile(): Profile | undefined {
      const profile = localStorage.getItem(LOCAL_STORAGE_ITEM_NAME)
      if (!profile) return undefined
      return JSON.parse(profile) as Profile
    }
  },
  actions: {
    async FetchProfile() {
      const url = new URL(import.meta.env.VITE_SPOTIFY_ENDPOINT + '/me')
      const profileDTO = await fetchWrapper.get<GetProfileResponse>(url)
      const profile = ParseProfileDTO(profileDTO)
      localStorage.setItem(LOCAL_STORAGE_ITEM_NAME, JSON.stringify(profile))
    },
  }
})
