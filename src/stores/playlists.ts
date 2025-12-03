import { defineStore } from 'pinia'
import { usePaginationStore } from './pagination'
import { fetchWrapper } from '@/utils/fetchwrapper/fetchWrapper'
import { UseTracksStore } from './tracks'
import { useProfileStore } from './profile'
import type { CreatePlaylistResponse, GetPlaylistsResponse, GetPlaylistTracksResponse, UsersPlaylistsResponse } from '@/types/spotify/responses'
import type { EpisodeDTO, PlaylistTrackDTO } from '@/types/spotify/dto'
import { ParsePlaylistTrackDTO } from '@/parsers/trackDtoParser'
import { ParsePlaylistEpisodeDTO } from '@/parsers/episodeDtoParser'
import { ParsePlaylistDTO } from '@/parsers/playlistDtoParser'
import type { Playlist } from '@/types/tapeify/models'
import { useCassettesStore } from './cassette'
import { apiClient } from '@/utils/api/clients'

const STORE_NAME = 'playlists'

export const usePlaylistsStore = defineStore(STORE_NAME, {
  state: () => ({
    playlists: [] as Playlist[]
  }),
  getters: {
    getPlaylists(state): Playlist[] {
      if (!state.playlists) return []
      return state.playlists
    }
  },
  actions: {
    async FetchUsersPlayists(): Promise<void> {
      const paginationStore = usePaginationStore();
      this.ClearPlaylists();

      const limit = paginationStore.getLimit;
      if (limit < 1 || limit > 50) throw new Error("Limit out of bounds");

      const offset = paginationStore.getOffset;
      if (offset < 0 || offset > 10000) throw new Error("Offset out of bounds");

      const response = await apiClient.get<UsersPlaylistsResponse>(
        "/me/playlists",
        {
          params: {
            limit,
            offset,
          },
        }
      );

      for (const playlist of response.data.items) {
        this.AddPlaylist(ParsePlaylistDTO(playlist));
      }

      paginationStore.setAvailability(
        response.data.previous != null,
        response.data.next != null
      );
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

      const url = new URL(import.meta.env.VITE_SPOTIFY_ENDPOINT + '/playlists/' + playlistId)
      const playlist = await fetchWrapper.get<GetPlaylistsResponse>(url)

      const limit = playlist.tracks.limit
      const total = playlist.tracks.total
      let offset = playlist.tracks.offset

      while(offset < total) {
        const url = new URL(import.meta.env.VITE_SPOTIFY_ENDPOINT + '/playlists/' + playlistId + '/tracks')
        url.searchParams.append('limit', String(limit))
        url.searchParams.append('offset', String(offset))
        
        const tracks = await fetchWrapper.get<GetPlaylistTracksResponse>(url)

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

      // cassetteStore.SetCassetteName(playlist.name)
    },

    async UploadNewPlaylist(name: string, description: string, is_public: boolean): Promise<Playlist> {
      const profileStore = useProfileStore()
      const userId = profileStore.id

      const url = new URL(import.meta.env.VITE_SPOTIFY_ENDPOINT + '/users/' + userId + '/playlists')

      if (name.length < 1 || name.length > 30) throw new Error('Name must be between 1 and 30 characters.')
      if (description.length < 1 || description.length > 200) throw new Error('Description must be between 1 and 30 characters.')

      const playlistDTO = await fetchWrapper.post<CreatePlaylistResponse>(url, {
        headers: {
         'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name, 
          description, 
          public: is_public 
        })
      })

      return ParsePlaylistDTO(playlistDTO)
    },
    async UploadTracksToPlaylists(playlist_id: string, track_uris: string[]) {
      const url = new URL(import.meta.env.VITE_SPOTIFY_ENDPOINT + '/playlists/' + playlist_id + '/tracks')
  
      if (track_uris.length > 100) throw new Error('Cannot upload more than 100 tracks to a playlist at once.')

      return await fetchWrapper.post(url, {
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uris: track_uris,
          position: 0
        })
      })
    }
  }
})
