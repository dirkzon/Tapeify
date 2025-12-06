import type { GetProfileResponse } from '@/types/spotify/responses'
import { apiClient } from '@/api/clients'
import { GetSmallestImage } from '@/utils/images/imageUtils'
import { useStorage } from '@vueuse/core'
import { defineStore } from 'pinia'

export const useProfileStore = defineStore('profile', {
  state: () => ({
    type: useStorage<string | undefined>('profile_type', undefined),
    id: useStorage<string | undefined>('profile_id', undefined),
    displayName: useStorage<string | undefined>('profile_display_name', undefined),
    image: useStorage<URL | undefined>('profile_image', undefined),
    uri: useStorage<string | undefined>('profile_uri', undefined),
    country: useStorage<string | undefined>('profile_country', undefined),
  }),
  getters: {},
  actions: {
    async FetchProfile() {
      const resposnse = await apiClient.get<GetProfileResponse>('/me')

      this.type = resposnse.data.type
      this.id = resposnse.data.id
      this.displayName = resposnse.data.display_name
      this.image = GetSmallestImage(resposnse.data.images)
      this.uri = resposnse.data.uri
      this.country = resposnse.data.country
    },
  }
})
