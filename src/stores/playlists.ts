import { defineStore } from 'pinia'
import { useTracksStore } from './tracks'
import type { CreatePlaylistResponse, GetPlaylistsResponse, GetPlaylistTracksResponse, SearchResponse, UsersPlaylistsResponse } from '@/types/spotify/responses'
import type { EpisodeDTO, PlaylistDTO, PlaylistTrackDTO } from '@/types/spotify/dto'
import { ParsePlaylistTrackDTO } from '@/parsers/trackDtoParser'
import { ParsePlaylistEpisodeDTO } from '@/parsers/episodeDtoParser'
import { useCassettesStore } from './cassette'
import { apiClient } from '@/api/clients'
import { ParsePlaylistDTO } from '@/parsers/playlistDtoParser'
import type { Playlist, PlaylistSearchResult, Track } from '@/types/tapeify/models'
import { useProfileStore } from './profile'
import { GetSmallestImage } from '@/utils/images/imageUtils'

export const usePlaylistsStore = defineStore('playlists', {
  actions: {
    async FetchUsersPlayists(limit: number = 10, offset: number = 0): Promise<PlaylistSearchResult> {
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
        playlists: playlists,
        next: !!response.data.next,
        previous: !!response.data.previous,
      }
    },
    async searchPlaylists(query: string, limit: number = 10, offset: number = 0): Promise<PlaylistSearchResult> {
      const profileStore = useProfileStore()

      const response = await apiClient.get<SearchResponse>('/search', {
        params: {
          q: query,
          type: 'playlist',
          market: profileStore.country,
          limit: limit,
          offset: offset,
        },
      })

      const playlists = response.data.playlists?.items.filter((playlist: PlaylistDTO) => playlist !== null).map((playlist: PlaylistDTO) => { return ParsePlaylistDTO(playlist) })

      return {
        playlists: playlists,
        next: response.data.playlists?.next !== null && playlists?.length > 0,
        previous: response.data.playlists?.previous !== null,
      }

    },
    async FetchPlaylistTracks(playlistId: string) {
      const cassetteStore = useCassettesStore()
      const tracksStore = useTracksStore()

      const playlistResponse = await apiClient.get<GetPlaylistsResponse>('/playlists/' + playlistId)
      const playlist = playlistResponse.data

      const limit = playlist.tracks.limit
      const total = playlist.tracks.total
      let offset = playlist.tracks.offset

      while (offset < total) {
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

      cassetteStore.updateName('default', playlist.name)
      cassetteStore.updateMetadata({
        owner_display_name: playlist.owner.display_name,
        owner_url: playlist.owner.external_urls.spotify,
        description: playlist.description,
        image_url: new URL(playlist.images[0].url),
        original_item_url: playlist.external_urls.spotify,
        item_name: playlist.name,
      })
    },
    async UploadNewPlaylist(name: string, description: string, isPublic: boolean): Promise<Playlist> {
      const profileStore = useProfileStore()
      const userId = profileStore.id

      const response = await apiClient.post<CreatePlaylistResponse>(`/users/${userId}/playlists`, {
        name: name,
        description: description,
        public: isPublic
      }, { headers: { "Content-Type": "application/json" } });


      return ParsePlaylistDTO(response.data)
    },
    async UploadTracksToPlaylists(playlistId: string, trackUris: string[]) {
      const chunkSize = 100;
      let position = 0;
      for (let i = 0; i < trackUris.length; i += chunkSize) {
        const chunk = trackUris.slice(i, i + chunkSize);
        await this._uploadTracks(playlistId, chunk, position);
        position += chunk.length;
      }
    },
    async _uploadTracks(playlistId: string, uris: string[], position: number) {
      const body = { uris, position };
      return await apiClient.post(`/playlists/${playlistId}/tracks`, body, {
        headers: { "Content-Type": "application/json" }
      });
    }
  }
})
