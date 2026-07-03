import type { Cassette, Track } from "@/types/tapeify/models"

export class Side {
    private tracksMap: Record<number, Track> = {};
    private anchoredIndices: Set<number> = new Set<number>();
    private maxIndex = -1;

    capacityMs: number;

    cassette: Cassette;
    sideIndex: number;

    constructor(cassette: Cassette, sideIndex: number) {
        this.cassette = cassette;
        this.sideIndex = sideIndex;
        this.capacityMs = cassette.capacityMs / cassette.sidesCount;
    }

    get durationMs(): number {
        return Object.values(this.tracksMap).reduce((total, t) => total + t.durationMs, 0);
    }
    get remainingMs(): number { return Math.max(0, this.capacityMs - this.durationMs) }

    public nextAvailableIndex(): number {
        for (let i = 0; i <= this.maxIndex; i++) {
            if (!this.anchoredIndices.has(i) && !(i in this.tracksMap)) {
                return i;
            }
        }
        const next = this.maxIndex + 1;
        this.maxIndex = next;
        return next;
    }

    public canFit(track: Track): boolean {
        return this.remainingMs >= track.durationMs;
    }

    public indexAvailable(index: number): boolean {
        return !this.anchoredIndices.has(index) && !(index in this.tracksMap);
    }

    public isAnchored(index: number): boolean {
        return this.anchoredIndices.has(index);
    }

    public getTrackAtIndex(index: number): Track | undefined {
        return this.tracksMap[index];
    }

    public anchorTrackAtIndex(track: Track, index: number) {
        if (this.anchoredIndices.has(index)) throw new Error("index already anchored")
        this.tracksMap[index] = track
        this.anchoredIndices.add(index)
        this.maxIndex = Math.max(this.maxIndex, index)
    }

    public placeAtIndex(realIndex: number, track: Track) {
        if (this.anchoredIndices.has(realIndex)) throw new Error("cannot overwrite anchored index")
        if (realIndex in this.tracksMap) throw new Error("slot already occupied")
        this.tracksMap[realIndex] = track
        this.maxIndex = Math.max(this.maxIndex, realIndex)
    }

    public toFlatArrayTrackIds(): Array<string> {
        const result: string[] = [];
        for (let i = 0; i <= this.maxIndex; i++) {
            const entry = this.tracksMap[i];
            if (entry) result.push(entry.id);
        }
        return result;
    }
}