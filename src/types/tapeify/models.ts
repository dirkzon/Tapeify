export interface Album {
  name: string
  id: string
  artists: string[]
  image?: URL
}

export interface Playlist {
  name: string
  id: string
  owner: string
  image?: URL
}

export interface PlaylistSearchResult {
  playlists: Playlist[]
  next: boolean
  previous: boolean
}

export interface AlbumSearchResult {
  albums: Album[]
  next: boolean
  previous: boolean
}

export interface Profile {
  type: string
  image?: URL
  uri: string
  id: string
  displayName: string
  country: string
}

// ----------------------------------------

export interface Cassette {
  name: string
  id: string
  capacityMs: number
}

export interface Anchor {
  cassetteId: string
  trackId: string
  sideIndex: number
  positionIndex: number
  locked?: boolean
}

export interface Track {
  name: string
  id: string
  spotifyId: string
  uri: string
  image?: URL
  explicit: boolean
  durationMs: number
  artists: string[]
}

export interface TapeSideLayout {
  cassetteId: string
  sideIndex: number
  tracks: Array<string | null>
  durationMs: number
}

export interface CassetteMetadata {
  owner_display_name: string
  item_name: string
  original_item_url: string
  owner_url: string
  description: string
  image_url?: URL
}

export interface CassetteAlert {
  cassetteId: string
  message: string
  priority: number
  action?: {
    fn: Function,
    message: string
  }
}

export type AlertRule = {
  when: (cassette: Cassette, sides: Record<number, TapeSideLayout>) => boolean
  message: string
  priority: number
  action?: (cassette: Cassette, sides: Record<number, TapeSideLayout>) => CassetteAlert['action']
}
