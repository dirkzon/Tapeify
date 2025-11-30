import type { Track } from '@/types/tapeify/models'
import type { TapeSide } from './tapeSideLayout'
import { TrackSorter } from './trackSorter'

export class KeepTrackOrder extends TrackSorter {
  readonly metaData = {
    type: "keep-order",
    name: "Keep Track Order",
    description: "Preserve original track order."
  }

  public sortTracks(sides: TapeSide[], unanchored_tracks: Track[]): void {
    const numSides = sides.length
    if (numSides === 0) return

    let currentSideIndex = 0

    for (const track of unanchored_tracks) {
      let placed = false

      // Try to place track in the current side or later sides
      for (let attempt = currentSideIndex; attempt < numSides; attempt++) {
        const side = sides[attempt]
        if (side.getRemainingMs() >= track.durationMs) {
          side.placeNext(track)
          placed = true
          currentSideIndex = attempt
          break
        }
      }

      // If the track doesn't fit in any remaining side, force it into the last side
      if (!placed) {
        sides[numSides - 1].placeNext(track)
        currentSideIndex = numSides - 1
      }
    }
  }
}
