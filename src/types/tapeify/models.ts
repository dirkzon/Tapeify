export interface Album {
  name: string
  id: string
  artists: string[]
  image?: URL
}

export interface CassetteSide {
  tracks: Track[]
  duration_ms: number
  name: String
}

export interface Playlist {
  name: string
  id: string
  owner: string
  image?: URL
}

export interface Profile {
  type: string
  image?: URL
  uri: string
  id: string
  display_name: string
  country: string
}

interface Anchor {
  side_index: number
  track_index: number
}

export interface Track {
  name: string
  id: string
  uri: string,
  image?: URL
  explicit: boolean
  duration_ms: number
  artists: string[]
  anchor?: Anchor
  anchored: boolean
}