<script lang="ts" setup>
import router from '@/router';
import type { Playlist } from '@/types/tapeify/models';
import { computed } from 'vue';

const props = defineProps<{
  playlists: Playlist[]
  loading: boolean
  loadingItemCount?: number
}>()

const itemCount = computed(() => props.loadingItemCount ?? 5);

function SelectItem(id: string) {
  router.push({
    name: '/CassetteView',
    query: { id: id, type: 'playlist' }
  })
}
</script>

<template>
  <v-list lines="two" density="compact" class="w-100 pa-0">
    <v-list-subheader> Playlists </v-list-subheader>

    <template v-if="loading">
      <v-list-item
        v-for="(_, i) in Array.from({ length: itemCount })"
        :key="i"
        class="w-100 m-0 pt-0 pb-0"
      >
        <template #prepend>
          <v-avatar tile>
            <v-skeleton-loader type="image" width="40" height="40" />
          </v-avatar>
        </template>

        <template #title>
            <v-skeleton-loader type="list-item-two-line"/>
        </template>
      </v-list-item>
    </template>

    <template v-else>
      <v-list-item
        v-for="playlist in playlists"
        :key="playlist.id"
        :title="playlist.name"
        :subtitle="playlist.owner"
        @click="SelectItem(playlist.id)"
        class="w-100"
      >
        <template #prepend>
          <v-avatar tile>
            <v-img v-if="playlist.image" :src="playlist.image.toString()" />
            <v-icon v-else icon="mdi-playlist-music" />
          </v-avatar>
        </template>

      </v-list-item>
    </template>
  </v-list>
</template>
