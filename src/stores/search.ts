import { defineStore } from 'pinia'
import type { SearchResponse } from '@/types/spotify/responses'
import { useProfileStore } from './profile'
import { apiClient } from '@/api/clients'
import type { AlbumDTO, PlaylistDTO } from '@/types/spotify/dto'
import { ParseAlbumDTO } from '@/parsers/albumDtoParser'
import { ParsePlaylistDTO } from '@/parsers/playlistDtoParser'

export const UseSearchStore = defineStore('search', {
  actions: { }
})
