import type { CassetteSide } from '@/stores/cassette'
import type { Track } from '@/stores/tracks'

export enum SortType {
  Greedy = 'greedy',
  KeepOrder = 'keep-order'
}

// The tracks parameter has the original order of album/playlist
export interface TrackSorter {
  type: SortType
  sortTracksInSides(sides: CassetteSide[], tracks: Track[]): CassetteSide[]
}
