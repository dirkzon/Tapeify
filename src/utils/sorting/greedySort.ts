import type { Track } from '@/stores/tracks'
import { SortType, TrackSorter } from './trackSorter'

export class GreedySort extends TrackSorter {
  type: SortType = SortType.Greedy

  sortUnanchoredTracks(unanchoredTracks: Track[]): void {
    const reversedTrackQueue = unanchoredTracks.sort((a, b) => (a.duration_ms < b.duration_ms ? -1 : 1))

    let longestTrack = reversedTrackQueue.pop()
    while (longestTrack) {
      const shortestDurIndex = this.cassetteSides.reduce(
        (minIndex, side, index, sides) =>
          side.duration_ms < sides[minIndex].duration_ms ? index : minIndex,
        0
      )
      this.PushTrackToSide(shortestDurIndex, longestTrack)
      this.cassetteSides[shortestDurIndex].duration_ms += longestTrack.duration_ms
      longestTrack = reversedTrackQueue.pop()
    }
  }
}
