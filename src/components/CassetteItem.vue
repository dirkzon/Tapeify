<script lang="ts" setup>
import { useAnchorsStore } from '@/stores/anchor';
import { useTracksStore } from '@/stores/tracks';
import { formatDuration } from '@/utils/duration/durationHelper';

const props = defineProps<{
    trackId: string,
    onLockClick: Function
}>()

const tracksStore = useTracksStore()
const anchorStore = useAnchorsStore()

const track = computed(() => tracksStore.GetTrackById(props.trackId))
const anchored = computed(() => anchorStore.isTrackAnchored(props.trackId))
const anchorIcon = computed(() => {
    if (anchorStore.isTrackAnchored(props.trackId)) {
        return "mdi-lock"
    } else {
        return "mdi-lock-open"
    }
})
</script>

<template>
    <v-hover>
        <template v-slot:default="{ isHovering, props }">
            <v-list-item active-class="text-secondary" class="py-2" handle=".drag-handle" v-bind="props">
                <template v-slot:prepend>
                    <v-icon class="drag-handle" icon="mdi-drag-vertical" size="large">
                    </v-icon>
                    <v-avatar tile>
                        <v-img v-if="track?.image" :src="track.image.href" />
                        <v-icon v-else icon="mdi-music" />
                    </v-avatar>
                </template>
                <v-list-item-title :title="track?.name">{{ track?.name }}</v-list-item-title>
                <v-list-item-subtitle :title="track?.artists.join()">{{ track?.artists.join() }}</v-list-item-subtitle>
                <template v-slot:append>
                    <div class="track-meta d-flex align-center">
                        <v-btn v-if="isHovering || anchored" :icon="anchorIcon" size="x-small" variant="text"
                            @click="onLockClick" />
                        <div class="text-subtitle-1">{{ formatDuration(track?.durationMs) }}</div>
                    </div>
                </template>
            </v-list-item>
        </template>
    </v-hover>
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
</style>
