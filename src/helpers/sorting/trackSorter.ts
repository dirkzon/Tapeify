import type { CassetteSide } from '@/stores/cassette'
import type { Track } from '@/stores/tracks'

export enum SortType {
  Greedy = 'greedy',
  KeepOrder = 'keep-order'
}

export abstract class TrackSorter {
  abstract type: SortType

  public PrePack(numBins: number, current: Track[][], updated: Track[][] ): void {
    console.log(numBins)
    console.log('current')
    console.log(current)
    console.log('updaeed')
    console.log(updated)
    console.log(updated == current)
  }
  abstract sortTracksInSides(sides: CassetteSide[], tracks: Track[]): CassetteSide[]
}
