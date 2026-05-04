<script lang="ts" setup>
const selectedTab = ref('user_playlists')
</script>

<template>
    <v-dialog max-width="800">
        <template v-slot:activator="{ props: activatorProps }">
            <v-btn v-bind="activatorProps" icon="mdi-playlist-plus" size="small" variant="text" />
        </template>

        <template v-slot:default>
            <v-card style="border-radius: 12px;">
                <v-toolbar color="primary" title="Select Playlist or Album">
                    <template v-slot:extension>
                        <v-tabs v-model="selectedTab" align-tabs="center">
                            <v-tab value="user_playlists">My Playlists</v-tab>
                            <v-tab value="search_albums">Search Albums</v-tab>
                            <v-tab value="search_playlists">Search Playlists</v-tab>
                        </v-tabs>
                    </template>
                </v-toolbar>
                <v-tabs-window v-model="selectedTab" class="pa-3">
                    <v-tabs-window-item value="user_playlists">
                        <user-playlists-tab />
                    </v-tabs-window-item>
                    <v-tabs-window-item value="search_albums">
                        <SearchAlbumsTab />
                    </v-tabs-window-item>
                    <v-tabs-window-item value="search_playlists">
                        <SearchPlaylistsTab />
                    </v-tabs-window-item>
                </v-tabs-window>
            </v-card>
        </template>
    </v-dialog>
</template>