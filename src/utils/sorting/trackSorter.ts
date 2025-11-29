import type { Anchor, Track } from "@/types/tapeify/models"
import type { TapeSide } from "./tapeSideLayout"

interface TrackSorterMetaData {
  type: string
  name: string
  description: string
}

export abstract class TrackSorter {
  abstract readonly metaData: TrackSorterMetaData

  constructor(protected sides: TapeSide[]) { }

  abstract sortTracks(sides: TapeSide[], unanchored_tracks: Track[]): void

  prepackAnchoredTracks(tracks: Track[], anchors: Anchor[]): Track[] {
    const anchored_tracks = [] as Track[]
    for (const anchor of anchors) {
      const track = tracks.find(t => t.id === anchor.trackId)
      if (!track) continue

      const side = this.sides.find(s => s.getCassetteId() === anchor.cassetteId && s.getSideIndex() === anchor.sideIndex)
      if (!side) continue
      side.placeAtIndex(anchor.positionIndex, track)
      anchored_tracks.push(track)
    }
    return anchored_tracks
  }
}
