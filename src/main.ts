/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

import './utils/sorting/registerTrackSorters'

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'
import CassetteSide from './components/CassetteSide.vue'
import TrackItem from './components/TrackItem.vue'
import AlbumsList from './components/AlbumList.vue'
import PlaylistsList from './components/PlaylistList.vue'
import UserPlaylistsTab from './components/UserPlaylistsTab.vue'
import SearchPlaylistsTab from './components/SearchPlaylistsTab.vue'
import SearchAlbumsTab from './components/SearchAlbumsTab.vue'
import CassetteSettingsDrawer from './components/CassetteSettingsDrawer.vue'
import { VueDraggableNext } from 'vue-draggable-next'
import AppFooter from './components/AppFooter.vue'
import UnavailableTracksList from './components/UnavailableTracksList.vue'
import CassetteItem from './components/CassetteItem.vue'
import CassetteActionsBar from './components/CassetteActionsBar.vue'

// Composables
import { createApp } from 'vue'

const app = createApp(App)

registerPlugins(app)

app.component('cassette-side', CassetteSide)
app.component('track-item', TrackItem)
app.component('playlist-list', PlaylistsList)
app.component('album-list', AlbumsList)
app.component('draggable', VueDraggableNext)
app.component('user-playlists-tab', UserPlaylistsTab)
app.component('search-playlists-tab', SearchPlaylistsTab)
app.component('search-albums-tab', SearchAlbumsTab)
app.component('cassette-settings-drawer', CassetteSettingsDrawer)
app.component('app-footer', AppFooter)
app.component('unavailable-tracks-list', UnavailableTracksList)
app.component('cassette-item', CassetteItem)
app.component('cassette-actions-bar', CassetteActionsBar)

app.mount('#app')
