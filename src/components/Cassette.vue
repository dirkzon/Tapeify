<script lang="ts" setup>
import { useCassettesStore } from '@/stores/cassette';
import CassetteSide from './CassetteSide.vue';
import { useSortingStore } from '@/stores/sorting';
import { useAnchorsStore } from '@/stores/anchor';
import { useTracksStore } from '@/stores/tracks';

const cassetteStore = useCassettesStore()
const sortingStore = useSortingStore();
const anchorsStore = useAnchorsStore();
const trackStore = useTracksStore();

const props = defineProps<{
  cassetteId: string
}>()

const cassette = computed(() => {
  return cassetteStore.getCassetteById(props.cassetteId)
})

const topAlert = computed(() => {
  return cassetteStore.topAlertForCassette(props.cassetteId)
})

function addCassette() {
  cassetteStore.addCassette()
  sortingStore.sortTracks()
}

function removeCassette() {
  cassetteStore.removeCassette(props.cassetteId)
  anchorsStore.removeAnchoresByCassetteId(props.cassetteId)
  sortingStore.sortTracks()
}

const capacityMinutes = computed<number>({
  get() {
    const ms = cassette.value?.capacityMs ?? 0
    return Math.round(ms / 60000)
  },
  set(mins: number) {
    if (!cassette.value) return
    cassetteStore.updateCapacity(cassette.value.id, mins * 60000)
    sortingStore.sortTracks()
  }
})

const name = computed<string>({
  get() {
    return cassette.value?.name ?? ''
  },
  set(val: string) {
    if (!cassette.value) return
    cassetteStore.updateName(cassette.value.id, val)
  }
})

function include() {
  return [document.querySelector('.included')]
}
</script>

<template>
  <v-card class="cassette-card" v-click-outside="{
    handler: trackStore.ClearSelectedTracks,
    include
  }">
    <v-toolbar color="primary">
      <template v-slot:prepend>
        <v-select v-model="capacityMinutes" :items="cassetteStore.possibleLengthsMin" dense hide-details class="ma-0"
          style="min-width:150px" label="Capacity (min)" />
      </template>
      <template v-slot:title>
        <v-text-field v-model="name" dense hide-details placeholder="Cassette name" class="cassette-title-field" />
      </template>
      <template v-slot:append>
        <v-btn icon @click="addCassette" title="Add cassette">
          <v-icon>mdi-playlist-plus</v-icon>
        </v-btn>
        <v-btn v-if="cassetteStore.cassettes.length > 1" icon @click="removeCassette" title="Remove cassette">
          <v-icon>mdi-playlist-minus</v-icon>
        </v-btn>
      </template>
    </v-toolbar>
    <v-alert v-if="topAlert" type="warning"
      variant="outlined">
      <div class="d-flex justify-space-between align-center w-100">
        <span>{{ topAlert.message }}</span>
        <a v-if="topAlert.action" class="text-decoration-underline cursor-pointer" @click="() => topAlert!.action!.fn()">
          {{ topAlert.action.message }}
        </a>
      </div>
    </v-alert>
    <v-row class="pa-2">
      <v-col>
        <CassetteSide :cassetteId="cassetteId" :sideIndex="0" />
      </v-col>

      <v-divider vertical class="full-height-divider" />

      <v-col>
        <CassetteSide :cassetteId="cassetteId" :sideIndex="1" />
      </v-col>
    </v-row>
  </v-card>
</template>

<style scoped>
.cassette-card {
  border-radius: 12px;
}
</style>
