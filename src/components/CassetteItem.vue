<script lang="ts" setup>
import { useTracksStore } from '@/stores/tracks';
import { formatDuration } from '@/utils/duration/durationHelper';

const props = defineProps<{
    trackId: string,
    clicked: Function
}>()

const tracksStore = useTracksStore()

const track = computed(() => tracksStore.GetTrackById(props.trackId))
</script>

<template>
    <v-list-item active-class="text-secondary" class="py-2" handle=".drag-handle" @click="clicked()">
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
        <template v-slot:append="{ isSelected }">
            <div class="track-meta d-flex align-center">
                <v-icon v-if="isSelected" size="16">mdi-lock</v-icon>
                <div class="text-subtitle-1">{{ formatDuration(track?.durationMs) }}</div>
            </div>
        </template>
    </v-list-item>
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
