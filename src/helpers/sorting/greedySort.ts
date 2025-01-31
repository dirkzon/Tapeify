import type { CassetteSide } from '@/stores/cassette'
import type { Track } from '@/stores/tracks'
import { SortType, type TrackSorter } from './trackSortInterface'

export class GreedySort implements TrackSorter {
  type: SortType = SortType.Greedy
  sortTracksInSides(sides: CassetteSide[], tracks: Track[]): CassetteSide[] {
    const reversedTrackQueue = tracks.sort((a, b) => (a.duration_ms < b.duration_ms ? -1 : 1))

    let longestTrack = reversedTrackQueue.pop()
    while (longestTrack) {
      const shortestDurationSideIndex = sides.reduce(
        (minIndex, side, index, sides) =>
          side.duration_ms < sides[minIndex].duration_ms ? index : minIndex,
        0
      )
      sides[shortestDurationSideIndex].tracks.push(longestTrack)
      sides[shortestDurationSideIndex].duration_ms += longestTrack.duration_ms
      longestTrack = reversedTrackQueue.pop()
    }
    return sides
  }
}
