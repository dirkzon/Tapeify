import type { CassetteSide } from '@/stores/cassette'
import type { Track } from '@/stores/tracks'

export enum SortType {
  Greedy = 'greedy',
  KeepOrder = 'keep-order'
}

export abstract class TrackSorter {
  public abstract type: SortType
  public cassetteSides: CassetteSide[] = []

  public PrePackAnchoredTracks(sides: CassetteSide[], anchoredTracks: Track[]): void{
    if (anchoredTracks.length <= 0) {
      this.cassetteSides = sides
      return
    }

    for (var track of anchoredTracks) {
      if(track.anchored && track.anchor) {
        const side = sides[track.anchor.side_index]
        const track_index = track.anchor.track_index

        side.tracks.length = Math.max(side.tracks.length, track_index + 1)
        side.tracks[track_index] = track
        side.duration_ms += track.duration_ms
      }
    }

    this.cassetteSides = sides
  }

  public ClearEmptyValues(): void {
    for (let i = 0; i < this.cassetteSides.length; i++) {
      let bruh = this.cassetteSides[i].tracks.findIndex(track => track === undefined)
      while(bruh !== -1) {
        this.cassetteSides[i].tracks.splice(bruh, 1)
        bruh = this.cassetteSides[i].tracks.findIndex(track => track === undefined)
      }
    }
  }

  public PushTrackToSide(side_index: number, track: Track) {
    const emptyIndex = this.cassetteSides[side_index].tracks.findIndex(track => track === undefined);
    if (emptyIndex === -1) {
      this.cassetteSides[side_index].tracks.push(track)
    } else {
      this.cassetteSides[side_index].tracks[emptyIndex] = track
    }
  }

  public abstract sortUnanchoredTracks(unanchoredTracks: Track[]): void
}
