import type { CassetteSide } from '@/stores/cassette'
import type { Track } from '@/stores/tracks'
import { SortType, TrackSorter } from './trackSorter'

export class KeepTrackOrder extends TrackSorter {
  type: SortType = SortType.KeepOrder
  sortTracksInSides(sides: CassetteSide[], tracks: Track[]): CassetteSide[] {
    const totalTracksLength = tracks.map((a) => a.duration_ms).reduce((a, b) => a + b, 0)
    const numSides = sides.length
    const sideTargetDuration = totalTracksLength / numSides

    let currentSide = 0

    for (const track of tracks) {
      sides[currentSide].tracks.push(track)
      sides[currentSide].duration_ms += track.duration_ms

      const currentDeviation = Math.abs(sides[currentSide].duration_ms - sideTargetDuration)
      const newDeviation = Math.abs(
        sides[currentSide].duration_ms +
          (tracks[tracks.indexOf(track) + 1]?.duration_ms || 0) -
          sideTargetDuration
      )

      if (currentSide < numSides - 1 && newDeviation > currentDeviation) {
        currentSide += 1
      }
    }

    return sides
  }
}
