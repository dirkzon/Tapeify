import type { Track } from "@/types/tapeify/models"
import type { TapeSideLayout } from "./tapeSideLayout"

export interface TrackSorterMetaData {
  type: string
  name: string
  description: string
}

export abstract class TrackSorter {
  abstract readonly metaData: TrackSorterMetaData

  constructor(protected sides: TapeSideLayout[]) { }

  abstract sortTracks(sides: TapeSideLayout[], unanchored_tracks: Track[]): void
}
