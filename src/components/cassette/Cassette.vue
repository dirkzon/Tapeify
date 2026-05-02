<script lang="ts" setup>
import { useCassettesStore } from '@/stores/cassette';
import CassetteSide from './CassetteSide.vue';
import { useAnchorsStore } from '@/stores/anchor';
import { useLayoutStore } from '@/stores/layout';

const cassetteStore = useCassettesStore()
const anchorsStore = useAnchorsStore();
const layoutStore = useLayoutStore()

const props = defineProps<{
  cassetteId: string,
  disableControls?: boolean
}>()

const cassette = computed(() => {
  return cassetteStore.getCassetteById(props.cassetteId)
})

const topAlert = computed(() => {
  return cassetteStore.alertForCassette(props.cassetteId)
})

function addCassette() {
  cassetteStore.addCassette()
  layoutStore.calculateLayout()
}

function removeCassette() {
  cassetteStore.removeCassette(props.cassetteId)
  anchorsStore.removeAnchoresByCassetteId(props.cassetteId)
  layoutStore.calculateLayout()
}

function addSide() {
  if (cassette.value == undefined) return
  cassetteStore.updateSidesCount(props.cassetteId, cassette.value.sidesCount + 1)
  layoutStore.calculateLayout()
}

function removeSide() {
  if (cassette.value == undefined) return
  if (cassette.value.sidesCount <= 1) return
  cassetteStore.updateSidesCount(props.cassetteId, cassette.value.sidesCount - 1)
  anchorsStore.removeAnchorsByTapeSide(props.cassetteId, cassette.value.sidesCount)
  layoutStore.calculateLayout()
}

const capacityMinutes = computed<number>({
  get() {
    const ms = cassette.value?.capacityMs ?? 0
    return Math.round(ms / 60000)
  },
  set(mins: number) {
    if (!cassette.value) return
    cassetteStore.updateCapacity(cassette.value.id, mins * 60000)
    layoutStore.calculateLayout()
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
    <v-toolbar color="primary">
      <template v-slot:prepend>
        <v-select v-model="capacityMinutes" :items="cassetteStore.possibleLengthsMin" density="compact" hide-details
          class="ma-0" style="min-width:150px" label="Capacity (min)" />
      </template>

      <template v-slot:title>
        <v-text-field v-model="name" density="compact" hide-details placeholder="Cassette name"
          class="cassette-title-field" />
      </template>

      <v-menu v-if="!props.disableControls">
        <template v-slot:activator="{ props }">
          <v-btn icon="mdi-dots-vertical" variant="text" v-bind="props"></v-btn>
        </template>

        <v-list>
          <v-list-subheader>Cassette</v-list-subheader>
          <v-divider />
          <v-list-item title="Add cassette" @click="addCassette" />
          <v-list-item title="Remove this cassette" @click="removeCassette" />
          <v-list-subheader>Sides</v-list-subheader>
          <v-divider />
          <v-list-item title="Add side" @click="addSide" />
          <v-list-item title="Remove side" @click="removeSide" :disabled="cassette!.sidesCount <= 1" />
        </v-list>
      </v-menu>
    </v-toolbar>
    <v-alert v-if="topAlert" type="warning" variant="outlined">
      <div class="d-flex justify-space-between align-center w-100">
        <span>{{ topAlert.message }}</span>
        <a v-if="topAlert.action" class="text-decoration-underline cursor-pointer"
          @click="() => topAlert!.action!.fn()">
          {{ topAlert.action.message }}
        </a>
      </div>
    </v-alert>
    <v-row class="pa-2">
      <v-col v-for="index in Array.from({ length: cassette?.sidesCount || 0 }, (_, i) => i)" :key="index" cols="12"
        sm="6">
        <CassetteSide :cassetteId="cassetteId" :sideIndex="index" />
      </v-col>
    </v-row>
  </v-card>
</template>

<style scoped>
.cassette-card {
  border-radius: 12px;
}
</style>
