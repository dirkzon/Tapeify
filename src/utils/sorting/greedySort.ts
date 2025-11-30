import type { Track } from "@/types/tapeify/models";
import type { TapeSide } from "./tapeSideLayout";
import { TrackSorter } from "./trackSorter";

export class GreedySort extends TrackSorter {
  public sortTracks(sides: TapeSide[], unanchored_tracks: Track[]): void {
    const sideCount = sides.length
    if (sideCount === 0) return

    const sorted = unanchored_tracks.slice().sort((a, b) => b.durationMs - a.durationMs)

    for (const track of sorted) {
      let best = 0
      let bestRem = sides[0].getRemainingMs()
      for (let i = 1; i < sideCount; i++) {
        const rem = sides[i].getRemainingMs()
        if (rem > bestRem) { best = i; bestRem = rem }
      }
      sides[best].placeNext(track)
    }
  }
}
