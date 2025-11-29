import type { Cassette, Slot, Track } from "@/types/tapeify/models"

export class TapeSideLayout {
    private tracksMap: Record<number, { trackId: string; durationMs: number }> = {}
    private anchoredIndices: Set<number> = new Set<number>()
    private maxIndex = -1
    private durationMs = 0

    constructor(private cassette: Cassette, private sideIndex: number) { }

    public anchorTrack(track: Track, index: number) {
        if (this.anchoredIndices.has(index)) throw new Error("index already anchored")
        this.tracksMap[index] = { trackId: track.id, durationMs: track.durationMs }
        this.anchoredIndices.add(index)
        this.maxIndex = Math.max(this.maxIndex, index)
        this.durationMs += track.durationMs
    }

    public nextAvailableIndex(): number {
        for (let i = 0; i <= this.maxIndex; i++) {
            if (!this.anchoredIndices.has(i) && !(i in this.tracksMap)) {
                return i
            }
        }
        const next = this.maxIndex + 1
        this.maxIndex = next
        return next
    }

    public placeAtIndex(realIndex: number, track: Track) {
        if (this.anchoredIndices.has(realIndex)) throw new Error("cannot overwrite anchored index")
        if (realIndex in this.tracksMap) throw new Error("slot already occupied")
        this.tracksMap[realIndex] = { trackId: track.id, durationMs: track.durationMs }
        this.maxIndex = Math.max(this.maxIndex, realIndex)
        this.durationMs += track.durationMs
    }

    public placeNext(track: Track): number {
        const idx = this.nextAvailableIndex()
        this.placeAtIndex(idx, track)
        return idx
    }

    public getCapacityMs(): number { return this.cassette.totalDurationMs }
    public getUsedMs(): number { return this.durationMs }
    public getRemainingMs(): number { return Math.max(0, this.cassette.totalDurationMs - this.durationMs) }
    public getCassetteId(): string { return this.cassette.id }
    public getSideIndex(): number { return this.sideIndex }

    public toArray(): Array<Slot | null> {
        return Array.from({ length: this.maxIndex + 1 }, (_, i) =>
            this.tracksMap[i] ? { trackId: this.tracksMap[i].trackId } : null
        )
    }
}
