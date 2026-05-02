<script lang="ts" setup>
import { useLayoutStore } from '@/stores/layout';

const layoutStore = useLayoutStore()

const selectedSortType = computed({
  get: () => layoutStore.selectedSortType,
  set: (val: string) => layoutStore.setSortType(val)
})
</script>

<template>
  <v-app-bar class="included pa-1">
    <template v-slot:prepend>
      <v-select v-model="selectedSortType" :items="layoutStore.getAvailableSorters()" item-value="type"
        density="compact" label="Sorting Algorithm" item-title="name" hide-details min-width="200" variant="outlined">
        <template v-slot:item="{ props: itemProps, item }">
          <v-list-item v-bind="itemProps" :subtitle="item.raw.description" :title="item.raw.name" />
        </template>
      </v-select>
    </template>

    <template v-slot:append>
      <v-btn block variant="outlined">
        Upload Cassette
        <upload-cassette-dialog />
      </v-btn>

    </template>
  </v-app-bar>
</template>
