<script lang="ts" setup>
import { usePlayerStore } from '@/stores/player';

const playerStore = usePlayerStore();

onMounted(() => playerStore.fetchAvailableDevices())
</script>

<template>
    <v-app-bar color="grey-lighten-2" height="75" location="bottom" flat>
        <template v-slot:append>
            <v-select :items="playerStore.available_devices" v-model="playerStore.selected_device" item-value="id"
                @update:modelValue="playerStore.transferPlayback" :menu-icon="null">
                <template #item="{ props, item }">
                    <v-list-item v-bind="props" :prepend-icon="item.raw.icon" :title="item.raw.name"
                        active-color="primary" />
                </template>
                <template #selection="{ item }">
                    <v-icon>{{ item.raw.icon }}</v-icon>
                </template>
            </v-select>
        </template>
    </v-app-bar>
</template>