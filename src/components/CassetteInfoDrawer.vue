<script lang="ts" setup>
import { useProjectStore } from '@/stores/project';

const projectStore = useProjectStore()
</script>

<template>
    <v-navigation-drawer floating v-model="projectStore.drawerOpen" location="right" color="transparent">
        <unavailable-tracks-list />
    </v-navigation-drawer>
</template>
