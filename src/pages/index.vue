<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useCassettesStore } from '@/stores/cassette'
import { useLayoutStore } from '@/stores/layout'
import { useProjectStore } from '@/stores/project'
import { useTracksStore } from '@/stores/tracks'
import type { Track } from '@/types/tapeify/models'
import { resetStores } from '@/utils/reset.stores'

const authStore = useAuthStore()
const trackStore = useTracksStore()
const layoutStore = useLayoutStore()
const cassetteStore = useCassettesStore()
const projectStore = useProjectStore()

async function AuthorizeUser() {
  const authUrl = await authStore.generateUserAuthorizationUrl()
  window.location.href = authUrl.toString()
}

const INIT_TRACKS = [ { "name": "Nu Moon", "spotifyId": "0o2vx3lJwK3BZMKl2vqtYM", "id": "7f446860-44ca-4439-bb3e-588557e69876", "uri": "spotify:track:0o2vx3lJwK3BZMKl2vqtYM", "explicit": false, "durationMs": 141693, "artists": [ "Discovery Zone" ], "image": "https://i.scdn.co/image/ab67616d000048517507a5adb06f2936b86b0e20", "source": "3tuD3ViZQFjDATCIplJePd" }, { "name": "Dance II", "spotifyId": "5iPyzbAvw84pJBJsFu05P4", "id": "9fe189d1-94ec-4c1b-95d6-c8554b5c5e51", "uri": "spotify:track:5iPyzbAvw84pJBJsFu05P4", "explicit": false, "durationMs": 271431, "artists": [ "Discovery Zone" ], "image": "https://i.scdn.co/image/ab67616d000048517507a5adb06f2936b86b0e20", "source": "3tuD3ViZQFjDATCIplJePd" }, { "name": "Nights", "spotifyId": "7eqoqGkKwgOaWNNHx90uEZ", "id": "89f534d4-8af7-4a7d-8847-8fbb29c86a27", "uri": "spotify:track:7eqoqGkKwgOaWNNHx90uEZ", "explicit": true, "durationMs": 307151, "artists": [ "Frank Ocean" ], "image": "https://i.scdn.co/image/ab67616d00004851c5649add07ed3720be9d5526", "source": "3tuD3ViZQFjDATCIplJePd" }, { "name": "Abusey Junction", "spotifyId": "3W4IoNW4011i8qfCwN75Va", "id": "172bd5ef-d6fa-4791-ad29-0290a8a31156", "uri": "spotify:track:3W4IoNW4011i8qfCwN75Va", "explicit": false, "durationMs": 424080, "artists": [ "Kokoroko" ], "image": "https://i.scdn.co/image/ab67616d0000485144d198c8f86d7e2d05864bd0", "source": "3tuD3ViZQFjDATCIplJePd" }, { "name": "Swept Away", "spotifyId": "2tuk3PezhFMV8fBB433tV0", "id": "9ed04062-508f-47e7-8f3c-07bfd8e4f137", "uri": "spotify:track:2tuk3PezhFMV8fBB433tV0", "explicit": false, "durationMs": 239952, "artists": [ "Vanilla" ], "image": "https://i.scdn.co/image/ab67616d000048516fa3da33a574843e86988d98", "source": "3tuD3ViZQFjDATCIplJePd" }, { "name": "bedroom community", "spotifyId": "4HJc004qYXE9zsG6PfTFFj", "id": "6e1f789a-6265-4bb8-89ec-5a694e8c3c24", "uri": "spotify:track:4HJc004qYXE9zsG6PfTFFj", "explicit": true, "durationMs": 361328, "artists": [ "glass beach" ], "image": "https://i.scdn.co/image/ab67616d00004851713370162839b17d761da70e", "source": "3tuD3ViZQFjDATCIplJePd" }, { "name": "yoshi's island", "spotifyId": "0VRQADlw43O3JTGp5KkEn7", "id": "b92cb291-ce2b-4364-a704-792b8b2c958b", "uri": "spotify:track:0VRQADlw43O3JTGp5KkEn7", "explicit": true, "durationMs": 378813, "artists": [ "glass beach" ], "image": "https://i.scdn.co/image/ab67616d00004851713370162839b17d761da70e", "source": "3tuD3ViZQFjDATCIplJePd" }, { "name": "Ivy", "spotifyId": "2ZWlPOoWh0626oTaHrnl2a", "id": "a40c27c1-c55a-455b-b885-4fec8061868e", "uri": "spotify:track:2ZWlPOoWh0626oTaHrnl2a", "explicit": true, "durationMs": 249191, "artists": [ "Frank Ocean" ], "image": "https://i.scdn.co/image/ab67616d00004851c5649add07ed3720be9d5526", "source": "3tuD3ViZQFjDATCIplJePd" }, { "name": "Borderline", "spotifyId": "5hM5arv9KDbCHS0k9uqwjr", "id": "e695f339-3121-42fa-b296-2159612168b6", "uri": "spotify:track:5hM5arv9KDbCHS0k9uqwjr", "explicit": false, "durationMs": 237800, "artists": [ "Tame Impala" ], "image": "https://i.scdn.co/image/ab67616d0000485158267bd34420a00d5cf83a49", "source": "3tuD3ViZQFjDATCIplJePd" }, { "name": "Summer", "spotifyId": "5DnVR3FYEj7wcpPCWrFfYo", "id": "002ae7f2-43d4-44e0-9ca8-67b2914fa7f8", "uri": "spotify:track:5DnVR3FYEj7wcpPCWrFfYo", "explicit": false, "durationMs": 280250, "artists": [ "Vanilla" ], "image": "https://i.scdn.co/image/ab67616d000048516fa3da33a574843e86988d98", "source": "3tuD3ViZQFjDATCIplJePd" }, { "name": "Should Have Known Better", "spotifyId": "3AyuigFWbuirWHvidbMz8O", "id": "418cb860-fe8e-4b72-92c1-6b2dae629ecf", "uri": "spotify:track:3AyuigFWbuirWHvidbMz8O", "explicit": false, "durationMs": 307697, "artists": [ "Sufjan Stevens" ], "image": "https://i.scdn.co/image/ab67616d00004851820e2ac14772ae3162c6d479", "source": "3tuD3ViZQFjDATCIplJePd" }, { "name": "The Dress", "spotifyId": "0YMe6PHRbeDcN7KJdCG0bW", "id": "152fa8b7-36a5-4cb5-89e2-d1fbeb627923", "uri": "spotify:track:0YMe6PHRbeDcN7KJdCG0bW", "explicit": false, "durationMs": 184767, "artists": [ "Dijon" ], "image": "https://i.scdn.co/image/ab67616d00004851708bfbe1855174ebc9a0f225", "source": "3tuD3ViZQFjDATCIplJePd" }, { "name": "Biking", "spotifyId": "2q0VexHJirnUPnEOhr2DxK", "id": "77f2506f-714d-4955-a88b-d8441a3eb72e", "uri": "spotify:track:2q0VexHJirnUPnEOhr2DxK", "explicit": true, "durationMs": 277520, "artists": [ "Frank Ocean", "JAŸ-Z", "Tyler, The Creator" ], "image": "https://i.scdn.co/image/ab67616d0000485169a8328489e5e485514a8667", "source": "3tuD3ViZQFjDATCIplJePd" }, { "name": "Nervous", "spotifyId": "113xf7t4qNM7038YJvauik", "id": "1c70402c-bf4d-4ce4-a93d-c74e3705c9b3", "uri": "spotify:track:113xf7t4qNM7038YJvauik", "explicit": false, "durationMs": 245000, "artists": [ "The Neighbourhood" ], "image": "https://i.scdn.co/image/ab67616d000048519b6ac98a52f62d5cb473da40", "source": "3tuD3ViZQFjDATCIplJePd" }, { "name": "Pink + White", "spotifyId": "3xKsf9qdS1CyvXSMEid6g8", "id": "522ceb4a-0438-4e8c-bb36-0de6b11b2341", "uri": "spotify:track:3xKsf9qdS1CyvXSMEid6g8", "explicit": false, "durationMs": 184516, "artists": [ "Frank Ocean" ], "image": "https://i.scdn.co/image/ab67616d00004851c5649add07ed3720be9d5526", "source": "3tuD3ViZQFjDATCIplJePd" }, { "name": "Boredom (feat. Rex Orange County & Anna of the North)", "spotifyId": "5WNYg3usc6H8N3MBEp4zVk", "id": "96712ba2-eea4-42b4-87ae-70635f865dfc", "uri": "spotify:track:5WNYg3usc6H8N3MBEp4zVk", "explicit": true, "durationMs": 320720, "artists": [ "Tyler, The Creator", "Rex Orange County", "Anna of the North" ], "image": "https://i.scdn.co/image/ab67616d000048518940ac99f49e44f59e6f7fb3", "source": "3tuD3ViZQFjDATCIplJePd" } ]  

onMounted(() => {
  cassetteStore.initAlerts()

  const tracks: Track[] = INIT_TRACKS.map((item) => ({
    name: item.name,
    id: item.id,
    spotifyId: item.spotifyId,
    uri: item.uri,
    image: item.image ? new URL(item.image) : undefined,
    explicit: item.explicit,
    durationMs: item.durationMs,
    artists: item.artists,
    source: item.source
  }))
  tracks.forEach((track) => trackStore.AddTrack(track))
  layoutStore.calculateLayout()
})
projectStore.addSource({
  type: 'playlist',
  name: 'demo',
  owner_display_name: 'demo',
  original_item_url: 'demo',
  owner_url: 'demo',
  description: 'demo'
}, "3tuD3ViZQFjDATCIplJePd")
onUnmounted(() => resetStores())
</script>

<template>
  <v-container class="py-8">
    <v-row justify="center">
      <v-col cols="12" md="8" lg="8">

        <div class="text-center mb-8">
          <h1 class="text-h3 font-weight-bold mb-3">
            Tapeify
          </h1>
          <p class="text-medium-emphasis">
            Turn your Spotify playlists and albums into cassette tapes.
          </p>
        </div>

        <div ref="gridRef" v-kbd-trap.roving.grid aria-label="item grid" class="mb-6">
          <cassette cassetteId="default" class="included" :disable-controls="true" />
        </div>

        <div class="text-center">
          <p class="text-medium-emphasis mb-3">
            Try it with your own playlists and albums.
          </p>

          <v-btn color="primary" @click="AuthorizeUser" prepend-icon="mdi-spotify" size="large">
            Login with Spotify
          </v-btn>
        </div>

      </v-col>
    </v-row>
  </v-container>
</template>