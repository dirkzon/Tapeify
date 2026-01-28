<script lang="ts" setup>
import { useAnchorsStore } from '@/stores/anchor';
import { useSortingStore } from '@/stores/sorting';
import { useTracksStore } from '@/stores/tracks';
import { formatDuration } from '@/utils/duration/durationHelper';

const props = defineProps<{
    trackId: string,
    onLockClick: (anchored: boolean) => void
}>()

const tracksStore = useTracksStore()
const anchorStore = useAnchorsStore()
const sortStore = useSortingStore()

const track = computed(() => tracksStore.GetTrackById(props.trackId))
const isAnchored = computed(() => anchorStore.isTrackAnchored(props.trackId))
const anchorIcon = computed(() => {
    if (anchorStore.isTrackAnchored(props.trackId)) {
        return "mdi-lock"
    } else {
        return "mdi-lock-open"
    }
})

function bulkSelect() {
    if (!tracksStore.lastSelectedTrackId) return
    const bulk = sortStore.getTracksIdsBetweenTracks(tracksStore.lastSelectedTrackId, props.trackId)
    tracksStore.selectedTracks = bulk
    console.log(tracksStore.selectedTracks)
}

function selectTrack() {
    tracksStore.lastSelectedTrackId = props.trackId
    if (tracksStore.selectedTracks.includes(props.trackId)) {
        console.log("containes")
    } else {
        tracksStore.selectedTracks = [props.trackId]
        console.log(tracksStore.selectedTracks)
    }
}
</script>

<template>
    <div>
        <v-hover :key="Number(isAnchored)">
            <template v-slot:default="{ isHovering, props }">
                <v-list-item active-class="text-secondary" class="py-2 no-select" handle=".drag-handle" v-bind="props" 
                    :value="trackId" @click.shift="bulkSelect" @click="selectTrack">
                    <template v-slot:prepend>
                        <v-icon class="drag-handle" icon="mdi-drag-vertical" size="large" />
                        <v-avatar tile>
                            <v-img v-if="track?.image" :src="track.image.href" />
                            <v-icon v-else icon="mdi-music" />
                        </v-avatar>
                    </template>
                    <v-list-item-title :title="track?.name">{{ track?.name }}</v-list-item-title>
                    <v-list-item-subtitle :title="track?.artists.join()">
                        {{ track?.artists.join() }}
                    </v-list-item-subtitle>
                    <template v-slot:append>
                        <div class="track-meta d-flex align-center">
                            <v-btn v-if="isAnchored || isHovering" :icon="anchorIcon" size="small" variant="text"
                                @click.stop="onLockClick(isAnchored)" />
                            <div class="text-subtitle-1">{{ formatDuration(track?.durationMs) }}</div>
                        </div>
                    </template>
                </v-list-item>
            </template>
        </v-hover>
    </div>
</template>


<style scoped>
.drag-handle {
    cursor: grab;
    margin-right: 10px;
    color: #999;
    user-select: none;
}

.drag-handle:active {
    cursor: grabbing;
}

.no-select {
  user-select: none;           /* Prevent text selection */
  -webkit-user-select: none;   /* For Safari */
  -moz-user-select: none;      /* For Firefox */
}
</style>
