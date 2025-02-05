<script setup lang="ts">
import { onMounted, toRefs } from 'vue'
import { useAlbumsStore } from '@/stores/album'
import { usePlaylistsStore } from '@/stores/playlists'
import { UseTracksStore } from '@/stores/tracks'
import { useCassetteStore } from '@/stores/cassette'
import { VueDraggableNext } from 'vue-draggable-next'
import { useSortingStore } from '@/stores/sorting'
import { SortType } from '@/helpers/sorting/trackSortInterface'

const playlistsStore = usePlaylistsStore()
const albumStore = useAlbumsStore()
const tracksStore = UseTracksStore()
const cassetteStore = useCassetteStore()
const sortStore = useSortingStore()
const { getSortingTypes } = toRefs(sortStore)
const { getSides } = toRefs(cassetteStore)

const sortType = defineModel<SortType>({
  default: SortType.Greedy
})

onMounted(async () => {
  tracksStore.ClearTracks()
  cassetteStore.ResetSides()
  const url = new URL(location.href)
  const id = url.searchParams.get('id')
  const type = url.searchParams.get('type')

  if (id && type) {
    switch (type) {
      case 'album':
        await albumStore.SetAlbumTracks(id)
        break
      case 'playlist':
        await playlistsStore.SetPlaylistTracks(id)
        break
    }
  }
  sort()
})

function sort() {
  cassetteStore.clearSidesTracks()
  sortStore.sortTracksInSides(sortType.value)
}

function AddSide() {
  cassetteStore.AddSide()
  sort()
}

function DeleteSide(id: string) {
  cassetteStore.DeleteSide(id)
  sort()
}

function getPrettySideDuration(ms: number): string {
  const hours = Math.floor(ms / (1000 * 60 * 60))
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((ms % (1000 * 60)) / 1000)

  if (hours >= 1) {
    return `${hours} hr ${minutes} min`
  } else {
    return `${minutes} min ${seconds} sec`
  }
}

function getPrettyTrackDuration(ms: number): string {
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((ms % (1000 * 60)) / 1000)

  const pad = (num: number) => num.toString().padStart(2, '0')

  return `${pad(minutes)}:${pad(seconds)}`
}
</script>

<template>
  <main>
    <v-select
      v-model="sortType"
      label="Sorting Style"
      :items="getSortingTypes"
      return-object
      single-line
      @update:model-value="sort"
    />

    <v-row>
      <v-col v-for="(cassetteSide, index) in getSides" :key="cassetteSide.id">
        <v-card flat class="mx-auto" max-width="700">
          <v-toolbar flat>
            <v-toolbar-title class="text-grey">
              {{ String.fromCharCode(97 + index).toUpperCase() }}
            </v-toolbar-title>
            <v-spacer />
            <v-btn
              v-if="index != 0"
              variant="plain"
              density="comfortable"
              icon="mdi-playlist-minus"
              @click="DeleteSide(cassetteSide.id)"
            />
          </v-toolbar>
          <v-card-subtitle>{{ getPrettySideDuration(cassetteSide.duration_ms) }}</v-card-subtitle>
          <v-list lines="two" density="compact">
            <VueDraggableNext group="sides">
              <v-list-item
                v-for="track in cassetteSide.tracks"
                :key="track.id"
                :title="track.name"
                :subtitle="track.artists.join()"
              >
                <template #prepend>
                  <v-avatar tile>
                    <v-img v-if="track.image" :src="track.image.href" />
                    <v-icon v-else icon="mdi-music" />
                  </v-avatar>
                </template>
                <template #append>
                  <v-list-item-action class="flex-column align-end">
                    <small class="text-high-emphasis opacity-60">{{
                      getPrettyTrackDuration(track.duration_ms)
                    }}</small>
                    <v-icon v-if="track.explicit" icon="mdi-alpha-e-box" size="small" />
                  </v-list-item-action>
                </template>
                <v-divider />
              </v-list-item>
            </VueDraggableNext>
          </v-list>
          <v-card />
        </v-card>
      </v-col>
    </v-row>
    <v-btn append-icon="mdi-playlist-plus" @click="AddSide"> Add side </v-btn>
  </main>
</template>
