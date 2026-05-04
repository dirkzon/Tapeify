<route>
{
  "meta": {
    "layout": "cassetteControls"
  }
}
</route>

<script setup lang="ts">
import { useCassettesStore } from '@/stores/cassette';
import { useKeyboardTrapFactory } from '@pdanpdan/vue-keyboard-trap'
import { resetStores } from '@/utils/reset.stores';
import { useProjectStore } from '@/stores/project';

const gridRef = ref<HTMLElement | null>(null)
const useKeyboardTrap = useKeyboardTrapFactory({})
useKeyboardTrap(gridRef, { roving: true, grid: true }, true)

const cassetteStore = useCassettesStore()
const projectStore = useProjectStore()

onMounted(() => cassetteStore.initAlerts())
onUnmounted(() => resetStores())
</script>

<template>
    <div ref="gridRef" v-kbd-trap.roving.grid aria-label="item grid">
        <v-row justify="center" v-if="projectStore.hasOrigins">
            <v-col v-for="cassette in cassetteStore.cassettes" :key="cassette.id" cols="12" sm="6">
                <cassette :cassetteId="cassette.id" class="included" />
            </v-col>
        </v-row>
    </div>
</template>
