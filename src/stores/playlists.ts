import { defineStore } from 'pinia'
import { usePaginationStore } from './pagination'
import { fetchWrapper } from '@/utils/fetchwrapper/fetchWrapper'
import { UseTracksStore, type Track } from './tracks'
import { GetSmallestImage } from '@/utils/images/imageUtils'
import { useProfileStore } from './profile'
import { useCassetteStore } from './cassette'
import type { GetPlaylistsResponse, GetPlaylistTracksResponse, UsersPlaylistsResponse } from '@/types/spotify/responses'
import { GetEpisodeArtists, GetTrackArists } from '@/utils/artists/artistUtils'
import type { EpisodeDTO, PlaylistItemDTO, TrackDTO } from '@/types/spotify/dto'

const STORE_NAME = 'playlists'

export interface Playlist {
  name: string
  id: string
  owner: string
  image?: URL
}

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
      const paginationStore = usePaginationStore()

      this.ClearPlaylists()

      const url = new URL(import.meta.env.VITE_SPOTIFY_ENDPOINT + '/me/playlists')

      const limit = paginationStore.getLimit
      if (limit < 1 || limit > 50) throw new Error('Limit out of bounds')
      url.searchParams.append('limit', String(limit))

      const offset = paginationStore.getOffset
      if (offset < 0 || offset > 10000) throw new Error('Offset out of bounds')
      url.searchParams.append('offset', String(offset))

      const result = await fetchWrapper.get<UsersPlaylistsResponse>(url)
      for (const playlist of result.items) {
        this.AddPlaylist({
          name: playlist.name,
          id: playlist.id,
          owner: playlist.owner.display_name,
          image: GetSmallestImage(playlist.images)
        })
      }

      const nextPageAvailable = result.next != null
      const previousPageAvailable = result.previous != null
      paginationStore.setAvailability(previousPageAvailable, nextPageAvailable)
    },
    AddPlaylist(playlist: Playlist) {
      this.playlists.push(playlist)
    },
    ClearPlaylists() {
      this.playlists = []
    },
    async FetchPlaylistTracks(playlistId: string) {
      const cassetteStore = useCassetteStore()

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
          if (track.type === 'track') this.SetPlaylistTrack(track as TrackDTO)
          if (track.type === 'episode') this.SetPlaylistEpisode(track as EpisodeDTO)
        }

        offset += limit
      }

      cassetteStore.SetCassetteName(playlist.name)
    },
    SetPlaylistTrack(track: TrackDTO) {
      const tracksStore = UseTracksStore()

      tracksStore.AddTrack({
        ...track,
        artists: GetTrackArists(track),
        image: GetSmallestImage(track.album.images),
        anchored: false
      })
    },
    SetPlaylistEpisode(episode: EpisodeDTO) {
      const tracksStore = UseTracksStore()

      tracksStore.AddTrack({
        ...episode,
        artists: GetEpisodeArtists(episode),
        image: GetSmallestImage(episode.album.images),
        anchored: false
      })
    },
    SetPlaylistTracks(items: PlaylistItemDTO[]) {
      const tracksStore = UseTracksStore()
    
      for (const item of items) {
        const track = item.track

        let artists: string[] = []
        let imagesUrl

        if (track.type === 'track') {
          artists = GetTrackArists(track as TrackDTO)
          imagesUrl = GetSmallestImage((track as TrackDTO).album.images)
        } 
        if (track.type === 'episode') {
          artists = GetEpisodeArtists(track as EpisodeDTO)
          imagesUrl = GetSmallestImage((track as EpisodeDTO).album.images)
        }

        tracksStore.AddTrack({
          ...track,
          artists: artists,
          image: imagesUrl,
          anchored: false
        })
      }
    },
    async UploadNewPlaylist(name: string, description: string, is_public: Boolean) {
      const profileStore = useProfileStore()
      const userId = profileStore.id

      const url = new URL(import.meta.env.VITE_SPOTIFY_ENDPOINT + '/users/' + userId + '/playlists')
      const body = new URLSearchParams();

      if (name.length < 1 || name.length > 30) throw new Error('Name must be between 1 and 30 characters.')
      body.append('name', name)

      if (description.length < 1 || description.length > 200) throw new Error('Description must be between 1 and 30 characters.')
      body.append('description', description)

      body.append('public', String(is_public))

      return await fetchWrapper.post(url, {
        body: body
      })
    },
    async UploadTracksToPlaylists(playlist_id: string, track_uris: string[]) {
      const url = new URL(import.meta.env.VITE_SPOTIFY_ENDPOINT + '/playlists/' + playlist_id + '/tracks')
      const body = new URLSearchParams();
  
      if (track_uris.length > 100) throw new Error('Cannot upload more than 100 tracks to a playlist at once.')
      body.append('uris', track_uris.join(','))

      body.append('position', '0')

      return await fetchWrapper.post(url, {
        body: body
      })
    }
  }
})
