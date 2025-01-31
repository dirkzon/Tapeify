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
</script>

<template>
  <main>
    <v-select
      v-model="sortType"
      label="Sorting type"
      :items="getSortingTypes"
      return-object
      single-line
      @update:model-value="sort"
    />

    <v-row>
      <v-col v-for="cassetteSide in getSides" :key="cassetteSide.id">
        <v-list lines="two" density="compact">
          <v-list-subheader>
            {{ String.fromCharCode(97 + cassetteSide.index) }} |
            {{
              `${Math.floor(cassetteSide.duration_ms / 60000)}:${((cassetteSide.duration_ms % 60000) / 1000).toFixed(0).padStart(2, '0')}`
            }}
          </v-list-subheader>
          <VueDraggableNext group="sides">
            <v-list-item
              v-for="track in cassetteSide.tracks"
              :key="track.id"
              :title="track.name"
              :subtitle="track.artists.join()"
            >
              <template #prepend>
                <v-avatar tile>
                  <v-img :src="track.image.href" />
                </v-avatar>
              </template>
              <template #append>
                <v-list-item-action class="flex-column align-end">
                  <small class="text-high-emphasis opacity-60">{{
                    `${Math.floor(track.duration_ms / 60000)}:${((track.duration_ms % 60000) / 1000).toFixed(0).padStart(2, '0')}`
                  }}</small>
                  <v-icon v-if="track.explicit" icon="mdi-alpha-e-box" size="small" />
                </v-list-item-action>
              </template>
              <v-divider />
            </v-list-item>
          </VueDraggableNext>
        </v-list>
      </v-col>
    </v-row>
  </main>
</template>
