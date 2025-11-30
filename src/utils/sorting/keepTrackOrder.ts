import type { Track, Anchor } from '@/types/tapeify/models'
import type { TapeSide } from './tapeSideLayout'
import { TrackSorter } from './trackSorter'

export class KeepTrackOrder extends TrackSorter {
  readonly metaData = {
    type: "keep-order",
    name: "Keep Track Order",
    description: "Preserve the original track order while filling sides as evenly as possible."
  }

  public sortTracks(sides: TapeSide[], unanchored_tracks: Track[]): void {
    const totalDuration = unanchored_tracks.reduce((sum, t) => sum + t.durationMs, 0)
    const numSides = sides.length
    if (numSides === 0) return

    const targetDurationPerSide = totalDuration / numSides
    let currentSide = 0

    for (let i = 0; i < unanchored_tracks.length; i++) {
      const track = unanchored_tracks[i]
      sides[currentSide].placeNext(track)

      const currentSideDuration = sides[currentSide].getUsedMs()
      const nextTrackDuration = unanchored_tracks[i + 1]?.durationMs ?? 0
      const currentDeviation = Math.abs(currentSideDuration - targetDurationPerSide)
      const newDeviation = Math.abs(currentSideDuration + nextTrackDuration - targetDurationPerSide)

      if (currentSide < numSides - 1 && newDeviation > currentDeviation) {
        currentSide += 1
      }
    }
  }
}
