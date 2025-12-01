<script lang="ts" setup>
import { useCassettesStore } from '@/stores/cassette';
import CassetteSide from './CassetteSide.vue';
import { useSortingStore } from '@/stores/sorting';

const cassetteStore = useCassettesStore()
const sortingStore = useSortingStore();

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
  <v-card class="cassette-card">
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

    <v-row class="cassette-row" align="stretch" no-gutters>
      <v-col cols="5" class="d-flex">
        <CassetteSide :cassetteId="cassetteId" :sideIndex="0" />
      </v-col>

      <v-col cols="auto" class="d-flex justify-center">
        <v-divider vertical class="full-height-divider" />
      </v-col>

      <v-col cols="5" class="d-flex">
        <CassetteSide :cassetteId="cassetteId" :sideIndex="1" />
      </v-col>
    </v-row>
  </v-card>
</template>

<style scoped>
.cassette-card {
  margin: 16px auto;
  max-width: 900px;
  width: 100%;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.cassette-row {
  min-height: 200px;
  margin: 16px;
}

.cassette-header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.cassette-title {
  font-weight: bold;
  font-size: 1.25rem;
}

.cassette-duration {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
}

.cassette-row {
  margin-top: 16px;
  gap: 16px;
}

.cassette-side-card {
  padding: 12px;
  background-color: #f7f7f7;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  min-height: 220px;
}

.full-height-divider {
  background-color: rgba(0, 0, 0, 0.12);
  margin: 0 8px;
}
</style>