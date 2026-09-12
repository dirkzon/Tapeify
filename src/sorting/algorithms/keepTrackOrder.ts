import type { Track } from "@/types/tapeify/models";
import { TrackSorter } from "../core/trackSorter";

export class KeepTrackOrder extends TrackSorter {
  sortTracks(unanchored_tracks: Track[]): void {
    const numSides = this.sides.length;
    if (numSides === 0) return;

    let currentSideIndex = 0;

    for (const track of unanchored_tracks) {
      let placed = false;

      for (let attempt = currentSideIndex; attempt < numSides; attempt++) {
        const side = this.sides[attempt];

        if (side.remainingMs >= track.durationMs) {
          const index = side.nextAvailableIndex();
          if (index === undefined) continue;

          side.placeAtIndex(index, track);
          placed = true;
          currentSideIndex = attempt;
          break;
        }
      }

      if (!placed) {
        const lastSide = this.sides[numSides - 1];
        const index = lastSide.nextAvailableIndex();
        if (index === undefined) throw new Error("No empty slot available on any side");
        lastSide.placeAtIndex(index, track);
        currentSideIndex = numSides - 1;
      }
    }
  }
}
