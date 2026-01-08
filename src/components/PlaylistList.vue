<script lang="ts" setup>
import router from '@/router';
import type { Playlist } from '@/types/tapeify/models';
import type { InfiniteScrollSide, InfiniteScrollStatus } from 'vuetify/lib/components/VInfiniteScroll/VInfiniteScroll.mjs';

const props = defineProps<{
  playlists: Playlist[]
  load: (options: { side: InfiniteScrollSide; done: (status: InfiniteScrollStatus) => void }) => void
}>()

function SelectItem(id: string) {
  router.push({
    name: '/CassetteView',
    query: { id: id, type: 'playlist' }
  })
}
</script>

<template>
  <v-list lines="two" density="compact" class="w-100 pa-0">

    <v-infinite-scroll height="500" @load="load" v-if="playlists.length > 0">
      <v-list-item v-for="playlist in playlists" :key="playlist.id" :title="playlist.name" :subtitle="playlist.owner"
        @click="SelectItem(playlist.id)" class="w-100">
        <template #prepend>
          <v-avatar tile>
            <v-img v-if="playlist.image" :src="playlist.image.toString()" />
            <v-icon v-else icon="mdi-playlist-music" />
          </v-avatar>
        </template>
      </v-list-item>
      <template v-slot:empty>
        <v-alert type="warning" text="No more playlists"></v-alert>
      </template>
      <template v-slot:error>
        <v-alert type="error" text="Error on fetching new playlists">
        </v-alert>
      </template>
    </v-infinite-scroll>
  </v-list>
</template>
