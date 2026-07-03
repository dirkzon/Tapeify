import type { Anchor, Track } from "@/types/tapeify/models"
import type { Side } from "./side"

export abstract class TrackSorter {
  constructor(protected sides: Side[]) { }

  abstract sortTracks(unanchored_tracks: Track[]): void

  _prepackAnchoredTracks(tracks: Track[], anchors: Record<string, Anchor>): void {
    for (const [trackId, anchor] of Object.entries(anchors)) {
      let track = tracks.find(t => t.id === trackId)
      if (!track) throw new Error(`Anchor refers to unknown track: ${trackId}`)
      const side = this.sides[anchor.sideIndex]
      if (!side) throw new Error(`Anchor refers to unknown side index: ${anchor.sideIndex}`)
      side.anchorTrackAtIndex(track, anchor.position)
    }
  }
}
