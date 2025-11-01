import type { Track } from '@/types/tapeify/models'
import { SortType, TrackSorter } from './trackSorter'

export class KeepTrackOrder extends TrackSorter {
  type: SortType = SortType.KeepOrder

  sortUnanchoredTracks(unanchoredTracks: Track[]): void { 
    const totalTracksLength = unanchoredTracks.map((a) => a.duration_ms).reduce((a, b) => a + b, 0)
    const numSides = this.cassetteSides.length
    const sideTargetDuration = totalTracksLength / numSides

    let currentSide = 0

    for (const track of unanchoredTracks) {
      this.PushTrackToSide(currentSide, track)
      this.cassetteSides[currentSide].duration_ms += track.duration_ms

      const currentDeviation = Math.abs(this.cassetteSides[currentSide].duration_ms - sideTargetDuration)
      const newDeviation = Math.abs(
        this.cassetteSides[currentSide].duration_ms +
          (unanchoredTracks[unanchoredTracks.indexOf(track) + 1]?.duration_ms || 0) -
          sideTargetDuration
      )

      if (currentSide < numSides - 1 && newDeviation > currentDeviation) {
        currentSide += 1
      }
    }
  }
}
