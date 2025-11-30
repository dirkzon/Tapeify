<script lang="ts" setup>
import { useCassettesStore } from '@/stores/cassette';
import CassetteSide from './CassetteSide.vue';
import { formatDuration } from '@/utils/duration/durationHelper';

const cassetteStore = useCassettesStore()

const props = defineProps<{
    cassetteId: string
}>()

const cassette = computed(() => {
    return cassetteStore.getCassetteById(props.cassetteId)
})
</script>

<template>
  <v-card class="cassette-card">
    <!-- Cassette Header -->
    <v-toolbar flat color="pink" class="cassette-header">
      <v-card-title class="cassette-title">{{ cassette?.name }}</v-card-title>
      <v-card-subtitle class="cassette-duration">{{ formatDuration(cassette?.totalDurationMs ?? 0) }}</v-card-subtitle>
    </v-toolbar>

    <v-row class="cassette-row" align="stretch" no-gutters>
      <!-- Side A -->
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
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.cassette-row {
    min-height: 200px;
    margin: 16px;
}

.cassette-header {
  border-bottom: 1px solid rgba(0,0,0,0.12);
}

.cassette-title {
  font-weight: bold;
  font-size: 1.25rem;
}

.cassette-duration {
  font-size: 0.875rem;
  color: rgba(255,255,255,0.8);
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
  background-color: rgba(0,0,0,0.12);
  margin: 0 8px;
}
</style>