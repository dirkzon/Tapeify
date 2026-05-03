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
  sidesCount: number
}

export interface Anchor {
  cassetteId: string
  sideIndex: number
  position: number
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
  origin: string
}

export interface TrackLocation {
  cassetteId: string
  sideIndex: number
  position: number
}

export interface TapeSideLayout {
  trackIds: Array<string>
  columnIndex: number
  durationMs: number
  sideIndex: number
}

export interface CassetteLayout {
  sides: Array<TapeSideLayout>
}

export interface CassetteAlert {
  message: string
  priority: number
  action?: {
    fn: Function,
    message: string
  }
}

export type AlertRule<TPayload = any> = {
  when: (
    cassette: Cassette,
    sides: Array<TapeSideLayout>
  ) => boolean | TPayload

  message: (
    cassette: Cassette,
    sides: Array<TapeSideLayout>,
    payload?: TPayload
  ) => string

  priority: (
    cassette: Cassette,
    sides: Array<TapeSideLayout>,
    payload?: TPayload
  ) => number

  action?: (
    cassette: Cassette,
    sides: Array<TapeSideLayout>,
    payload?: TPayload
  ) => CassetteAlert['action']
}

export interface Origin {
  type: 'playlist' | 'album',
  name: string
  owner_display_name: string
  original_item_url: string
  owner_url: string
  description: string
}
