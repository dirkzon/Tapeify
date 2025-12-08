<script lang="ts" setup>
import { useCassettesStore } from '@/stores/cassette';
import CassetteSide from './CassetteSide.vue';
import { useSortingStore } from '@/stores/sorting';
import { useAnchorsStore } from '@/stores/anchor';

const cassetteStore = useCassettesStore()
const sortingStore = useSortingStore();
const anchorsStore = useAnchorsStore();

const props = defineProps<{
  cassetteId: string
}>()

const cassette = computed(() => {
  return cassetteStore.getCassetteById(props.cassetteId)
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
</script>

<template>
  <v-card class="cassette-card" variant="outlined">
    <v-toolbar color="pink">
      <template v-slot:prepend>
        <v-select v-model="capacityMinutes" :items="[60, 90, 120]" dense hide-details class="ma-0"
          style="min-width:140px" label="Capacity (min)" />
      </template>
      <template v-slot:title>
        <v-text-field v-model="name" dense hide-details placeholder="Cassette name"
          class="cassette-title-field" />
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

    <v-row class="cassette-row"no-gutters>
      <v-col class="d-flex">
        <CassetteSide :cassetteId="cassetteId" :sideIndex="0" />
      </v-col>

      <v-divider vertical class="full-height-divider" />

      <v-col class="d-flex">
        <CassetteSide :cassetteId="cassetteId" :sideIndex="1" />
      </v-col>
    </v-row>
  </v-card>
</template>

<style scoped>
.cassette-card {
  width: 100%;
  border-radius: 12px;
}

.cassette-row {
  margin: 16px;
}

.cassette-row {
  margin-top: 16px;
  gap: 16px;
}
</style>