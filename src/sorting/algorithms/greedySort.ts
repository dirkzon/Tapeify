import type { Track } from "@/types/tapeify/models";
import { TrackSorter } from "../core/trackSorter";

export class GreedySort extends TrackSorter {
  sortTracks(unanchored_tracks: Track[]): void {
    if (this.sides.length === 0) return;

    const sorted = unanchored_tracks
      .slice()
      .sort((a, b) => b.durationMs - a.durationMs);

    for (const track of sorted) {
      let best = 0;
      let bestRem = this.sides[0].remainingMs;

      for (let i = 1; i < this.sides.length; i++) {
        const rem = this.sides[i].remainingMs;
        if (rem > bestRem) {
          best = i;
          bestRem = rem;
        }
      }

      const nextIndex = this.sides[best].nextAvailableIndex();
      if (nextIndex === -1) throw new Error("No empty slot available on selected side");

      this.sides[best].placeAtIndex(nextIndex, track);
    }
  }
}
