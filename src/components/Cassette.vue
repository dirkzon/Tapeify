<script lang="ts" setup>
import { useCassettesStore } from '@/stores/cassette';
import CassetteSide from './CassetteSide.vue';

const cassetteStore = useCassettesStore()

const props = defineProps<{
    cassetteId: string
}>()

const cassette = computed(() => {
    return cassetteStore.getCassetteById(props.cassetteId)
})
</script>

<template>
    <div>
        <h2>Cassette: {{ cassette?.name }} | {{ cassette?.totalDurationMs / 60000 }}</h2>
        <CassetteSide v-for="sideIndex in 2" :key="sideIndex" :cassetteId="cassetteId" :sideIndex="sideIndex - 1" />
    </div>
</template>