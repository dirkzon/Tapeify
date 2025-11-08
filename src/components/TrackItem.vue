<script setup lang="ts">
import { UseTracksStore } from '@/stores/tracks'
import type { Track } from '@/types/tapeify/models'
import { useSortingStore } from '@/stores/sorting'

const trackStore = UseTracksStore()
const sortStore = useSortingStore()

const props = defineProps<{
    track: Track
    side_index: number
    track_index: number
}>()

function getPrettyTrackDuration(): string {
  const ms = props.track.duration_ms
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((ms % (1000 * 60)) / 1000)

  const pad = (num: number) => num.toString().padStart(2, '0')

  return `${pad(minutes)}:${pad(seconds)}`
}

function SetAnchor() {
    if (props.track.anchored) {       
        trackStore.UnAnchorTrack(props.track.id)
    } else {
        trackStore.AnchorTrack(props.side_index, props.track_index, props.track.id)
    }
    sortStore.sortTracksInSides()
}
</script>

<template>
    <v-list-item>
        <template v-slot:prepend>
            <v-icon
                icon="mdi-drag-vertical" 
                size="large">
            </v-icon>
            <v-avatar tile>
                <v-img v-if="track.image" :src="track.image.href" />
                <v-icon v-else icon="mdi-music" />
            </v-avatar>
        </template>
        <v-list-item-title :title="track.name">{{ track.name }}</v-list-item-title>
        <v-list-item-subtitle :title="track.artists.join()">{{ track.artists.join() }}</v-list-item-subtitle>
        <template v-slot:append="{ isSelected }">
          <v-list-item-action class="flex-column">
            <small class="mb-4 text-high-emphasis opacity-60">{{ getPrettyTrackDuration() }}</small>

            <v-spacer></v-spacer>

            <v-icon v-if="isSelected" color="opacity-80" size="x-small">mdi-lock</v-icon>
            <v-icon v-else class="opacity-80" size="x-small">mdi-lock-open-variant</v-icon>
          </v-list-item-action>
        </template>
    </v-list-item>
    <!-- <v-hover v-slot:default="{ isHovering: trackHovering, props: trackHoverProps }">
        <v-list-item v-bind="trackHoverProps" :title="track.name" :subtitle="track.artists.join()">
            <template #prepend>
                <span class="drag-handle">⋮⋮</span>
                <v-avatar tile>
                    <v-img v-if="track.image" :src="track.image.href" />
                    <v-icon v-else icon="mdi-music" />
                </v-avatar>
            </template>
            <template #append>
                <v-list>
                    <v-list-item-action class="flex-column align-end">
                        <small class="text-high-emphasis opacity-60">{{
                            getPrettyTrackDuration()
                        }}</small>
                    </v-list-item-action>
                    <v-list-item-action>
                        <v-icon v-if="track.explicit" icon="mdi-alpha-e-box" size="small" />
                        <v-hover 
                        v-slot:default="{ isHovering: lockHovering, props: lockHoverProps }" 
                        >
                            <v-btn
                                v-bind="lockHoverProps"
                                @click="SetAnchor()"
                                v-if="trackHovering || track.anchored" 
                                flat size="x-small">
                                <v-icon 
                                    v-if="track.anchored" 
                                    :icon="lockHovering ? 'mdi-lock-open-variant' : 'mdi-lock'" 
                                    size="medium">
                                </v-icon>
                                <v-icon
                                    v-else 
                                    :icon="lockHovering ? 'mdi-lock' : 'mdi-lock-open-variant'" 
                                    size="medium">
                                </v-icon>
                            </v-btn>
                        </v-hover>
                    </v-list-item-action>
                </v-list>
            </template>
            <v-divider />
        </v-list-item>
    </v-hover> -->
</template>
