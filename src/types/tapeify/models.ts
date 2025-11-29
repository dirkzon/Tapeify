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
  totalDurationMs: number
}

export interface Anchor {
  id: string
  cassetteId: string
  trackId: string
  sideIndex: number
  positionIndex: number
  locked?: boolean
}

export interface Track {
  name: string
  id: string
  uri: string
  image?: URL
  explicit: boolean
  durationMs: number
  artists: string[]
}

export interface Slot {
  trackId: string
}

// export interface Cassette {
//   name: string             // display name
//   id: string               // unique cassette ID
//   totalDurationMs: number  // total time across all sides
// }

// export interface TapeSide {
//   cassetteId: string       // foreign key to cassette
//   sideIndex: number        // 0 = A, 1 = B, etc.
//   label: string            // "A", "B", etc.
//   capacityMs: number       // max duration in ms for this side
// }

// export interface Anchor {
//   id: string        // stable unique ID for this anchor
//   cassetteId: string      // stable unique ID of the cassette this track belongs to
//   trackId: string         // the track being anchored
//   sideIndex: number       // which side of the cassette (0 = A, 1 = B, etc.)
//   positionIndex: number   // preferred order/slot of the track within the side
//   locked?: boolean        // optional: prevents algorithm or user from moving it
// }

// export interface Track {
//   name: string            // track title
//   id: string              // unique track ID
//   uri: string             // Spotify URI
//   image?: URL             // optional album art
//   explicit: boolean       // is the track marked explicit
//   durationMs: number      // duration in milliseconds
//   artists: string[]       // list of artist names
// }