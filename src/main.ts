/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'
import CassetteSide from './components/CassetteSide.vue'
import TrackItem from './components/TrackItem.vue'
import { VueDraggableNext } from 'vue-draggable-next'

// Composables
import { createApp } from 'vue'

const app = createApp(App)

registerPlugins(app)

app.component('cassette-side', CassetteSide)
app.component('track-item', TrackItem)
app.component('draggable', VueDraggableNext)

app.mount('#app')
