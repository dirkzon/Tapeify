import { defineStore } from 'pinia'
import { UseTracksStore } from './tracks'
import type { GetPlaylistsResponse, GetPlaylistTracksResponse, UsersPlaylistsResponse } from '@/types/spotify/responses'
import type { EpisodeDTO, PlaylistDTO, PlaylistTrackDTO } from '@/types/spotify/dto'
import { ParsePlaylistTrackDTO } from '@/parsers/trackDtoParser'
import { ParsePlaylistEpisodeDTO } from '@/parsers/episodeDtoParser'
import type { Playlist } from '@/types/tapeify/models'
import { useCassettesStore } from './cassette'
import { apiClient } from '@/api/clients'
import { ParsePlaylistDTO } from '@/parsers/playlistDtoParser'
import type { SearchResult } from '@/types/tapeify/models'

export const usePlaylistsStore = defineStore('playlists', {
  state: () => ({
    playlists: [] as Playlist[]
  }),
  getters: {},
  actions: {
    async FetchUsersPlayists(limit: number = 10, offset: number = 0): Promise<SearchResult> {
      const response = await apiClient.get<UsersPlaylistsResponse>(
        "/me/playlists",
        {
          params: {
            limit,
            offset,
          },
        }
      );
      const playlists = response.data.items.map((playlist: PlaylistDTO) => { return ParsePlaylistDTO(playlist) })

      return {
        albums: [],
        playlists: playlists,
        next: !!response.data.next,
        previous:!!response.data.previous,
      }
    },
    AddPlaylist(playlist: Playlist) {
      this.playlists.push(playlist)
    },
    ClearPlaylists() {
      this.playlists = []
    },
    async FetchPlaylistTracks(playlistId: string) {
      const cassetteStore = useCassettesStore()
      const tracksStore = UseTracksStore()

      const playlistResponse = await apiClient.get<GetPlaylistsResponse>('/playlists/' + playlistId)
      const playlist = playlistResponse.data
      cassetteStore.updateName('cassette-1', playlist.name)

      const limit = playlist.tracks.limit
      const total = playlist.tracks.total
      let offset = playlist.tracks.offset

      while(offset < total) {
        const trackResponse = await apiClient.get<GetPlaylistTracksResponse>('/playlists/' + playlistId + '/tracks', {
          params: {
            limit,
            offset,
          },
        })
        
        const tracks = trackResponse.data

        for (const item of tracks.items) {
          const track = item.track
          if (track.type === 'track') {
            tracksStore.AddTrack(ParsePlaylistTrackDTO(track as PlaylistTrackDTO))
          }
          if (track.type === 'episode') {
            tracksStore.AddTrack(ParsePlaylistEpisodeDTO(track as EpisodeDTO))
          }
        }

        offset += limit
      }
    },

    // async UploadNewPlaylist(name: string, description: string, is_public: boolean): Promise<Playlist> {
    //   const profileStore = useProfileStore()
    //   const userId = profileStore.id

    //   const url = new URL(import.meta.env.VITE_SPOTIFY_ENDPOINT + '/users/' + userId + '/playlists')

    //   if (name.length < 1 || name.length > 30) throw new Error('Name must be between 1 and 30 characters.')
    //   if (description.length < 1 || description.length > 200) throw new Error('Description must be between 1 and 30 characters.')

    //   const playlistDTO = await fetchWrapper.post<CreatePlaylistResponse>(url, {
    //     headers: {
    //      'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ 
    //       name, 
    //       description, 
    //       public: is_public 
    //     })
    //   })

    //   return ParsePlaylistDTO(playlistDTO)
    // },
    // async UploadTracksToPlaylists(playlist_id: string, track_uris: string[]) {
    //   const url = new URL(import.meta.env.VITE_SPOTIFY_ENDPOINT + '/playlists/' + playlist_id + '/tracks')
  
    //   if (track_uris.length > 100) throw new Error('Cannot upload more than 100 tracks to a playlist at once.')

    //   return await fetchWrapper.post(url, {
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       uris: track_uris,
    //       position: 0
    //     })
    //   })
    // }
  }
})
