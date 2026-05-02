<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useCassettesStore } from '@/stores/cassette'
import { useLayoutStore } from '@/stores/layout'
import { useTracksStore } from '@/stores/tracks'
import type { Track } from '@/types/tapeify/models'
import { resetStores } from '@/utils/reset.stores'

const authStore = useAuthStore()
const trackStore = useTracksStore()
const layoutStore = useLayoutStore()
const cassetteStore = useCassettesStore()

async function AuthorizeUser() {
  const authUrl = await authStore.generateUserAuthorizationUrl()
  window.location.href = authUrl.toString()
}

const INIT_TRACKS = [{ "name": "Nu Moon", "spotifyId": "0o2vx3lJwK3BZMKl2vqtYM", "id": "ba5f6d65-1869-4330-bfba-9aebdea29746", "uri": "spotify:track:0o2vx3lJwK3BZMKl2vqtYM", "explicit": false, "durationMs": 141693, "artists": ["Discovery Zone"], "image": "https://i.scdn.co/image/ab67616d000048517507a5adb06f2936b86b0e20" }, { "name": "Dance II", "spotifyId": "5iPyzbAvw84pJBJsFu05P4", "id": "5d5a594c-393b-4cd5-a392-f1bb1967c847", "uri": "spotify:track:5iPyzbAvw84pJBJsFu05P4", "explicit": false, "durationMs": 271431, "artists": ["Discovery Zone"], "image": "https://i.scdn.co/image/ab67616d000048517507a5adb06f2936b86b0e20" }, { "name": "Nights", "spotifyId": "7eqoqGkKwgOaWNNHx90uEZ", "id": "ef94b849-4a71-4059-85eb-b4f26bb9d3bb", "uri": "spotify:track:7eqoqGkKwgOaWNNHx90uEZ", "explicit": true, "durationMs": 307151, "artists": ["Frank Ocean"], "image": "https://i.scdn.co/image/ab67616d00004851c5649add07ed3720be9d5526" }, { "name": "Abusey Junction", "spotifyId": "3W4IoNW4011i8qfCwN75Va", "id": "8158e6a7-4f07-445e-a78b-cb0ed43bbaf4", "uri": "spotify:track:3W4IoNW4011i8qfCwN75Va", "explicit": false, "durationMs": 424080, "artists": ["Kokoroko"], "image": "https://i.scdn.co/image/ab67616d0000485144d198c8f86d7e2d05864bd0" }, { "name": "Swept Away", "spotifyId": "2tuk3PezhFMV8fBB433tV0", "id": "5cd7a1e5-1afb-4735-a86f-b25d674c93f1", "uri": "spotify:track:2tuk3PezhFMV8fBB433tV0", "explicit": false, "durationMs": 239952, "artists": ["Vanilla"], "image": "https://i.scdn.co/image/ab67616d000048516fa3da33a574843e86988d98" }, { "name": "bedroom community", "spotifyId": "4HJc004qYXE9zsG6PfTFFj", "id": "56245bb5-8591-4f0d-972f-72663399153e", "uri": "spotify:track:4HJc004qYXE9zsG6PfTFFj", "explicit": true, "durationMs": 361328, "artists": ["glass beach"], "image": "https://i.scdn.co/image/ab67616d00004851713370162839b17d761da70e" }, { "name": "yoshi's island", "spotifyId": "0VRQADlw43O3JTGp5KkEn7", "id": "7de4962e-15bd-4375-89e5-6a07a3a7b229", "uri": "spotify:track:0VRQADlw43O3JTGp5KkEn7", "explicit": true, "durationMs": 378813, "artists": ["glass beach"], "image": "https://i.scdn.co/image/ab67616d00004851713370162839b17d761da70e" }, { "name": "Ivy", "spotifyId": "2ZWlPOoWh0626oTaHrnl2a", "id": "58c3567c-54eb-4cb8-b480-db67f227c97b", "uri": "spotify:track:2ZWlPOoWh0626oTaHrnl2a", "explicit": true, "durationMs": 249191, "artists": ["Frank Ocean"], "image": "https://i.scdn.co/image/ab67616d00004851c5649add07ed3720be9d5526" }, { "name": "Borderline", "spotifyId": "5hM5arv9KDbCHS0k9uqwjr", "id": "3c6a6fcd-ff02-4d80-9f92-29d166afad6e", "uri": "spotify:track:5hM5arv9KDbCHS0k9uqwjr", "explicit": false, "durationMs": 237800, "artists": ["Tame Impala"], "image": "https://i.scdn.co/image/ab67616d0000485158267bd34420a00d5cf83a49" }, { "name": "Summer", "spotifyId": "5DnVR3FYEj7wcpPCWrFfYo", "id": "2f10a51c-e97a-47ec-a689-1b3576d01c9f", "uri": "spotify:track:5DnVR3FYEj7wcpPCWrFfYo", "explicit": false, "durationMs": 280250, "artists": ["Vanilla"], "image": "https://i.scdn.co/image/ab67616d000048516fa3da33a574843e86988d98" }, { "name": "Should Have Known Better", "spotifyId": "3AyuigFWbuirWHvidbMz8O", "id": "71dcf13e-f943-483a-9276-b2ff9c536114", "uri": "spotify:track:3AyuigFWbuirWHvidbMz8O", "explicit": false, "durationMs": 307697, "artists": ["Sufjan Stevens"], "image": "https://i.scdn.co/image/ab67616d00004851820e2ac14772ae3162c6d479" }, { "name": "The Dress", "spotifyId": "0YMe6PHRbeDcN7KJdCG0bW", "id": "925cdb38-c870-4738-9e00-5ebdb872dd7e", "uri": "spotify:track:0YMe6PHRbeDcN7KJdCG0bW", "explicit": false, "durationMs": 184767, "artists": ["Dijon"], "image": "https://i.scdn.co/image/ab67616d00004851708bfbe1855174ebc9a0f225" }, { "name": "Biking", "spotifyId": "2q0VexHJirnUPnEOhr2DxK", "id": "5e66789c-1b25-4d08-9357-31b6eb50b2bb", "uri": "spotify:track:2q0VexHJirnUPnEOhr2DxK", "explicit": true, "durationMs": 277520, "artists": ["Frank Ocean", "JAŸ-Z", "Tyler, The Creator"], "image": "https://i.scdn.co/image/ab67616d0000485169a8328489e5e485514a8667" }, { "name": "Nervous", "spotifyId": "113xf7t4qNM7038YJvauik", "id": "2bd1b8e8-c91a-4ddc-bc52-4a4709128a81", "uri": "spotify:track:113xf7t4qNM7038YJvauik", "explicit": false, "durationMs": 245000, "artists": ["The Neighbourhood"], "image": "https://i.scdn.co/image/ab67616d000048519b6ac98a52f62d5cb473da40" }, { "name": "Pink + White", "spotifyId": "3xKsf9qdS1CyvXSMEid6g8", "id": "654f17ef-2325-45db-bba7-f022209f8039", "uri": "spotify:track:3xKsf9qdS1CyvXSMEid6g8", "explicit": false, "durationMs": 184516, "artists": ["Frank Ocean"], "image": "https://i.scdn.co/image/ab67616d00004851c5649add07ed3720be9d5526" }, { "name": "Boredom (feat. Rex Orange County & Anna of the North)", "spotifyId": "5WNYg3usc6H8N3MBEp4zVk", "id": "15d30e93-3fba-4977-8d7e-f437e5709e37", "uri": "spotify:track:5WNYg3usc6H8N3MBEp4zVk", "explicit": true, "durationMs": 320720, "artists": ["Tyler, The Creator", "Rex Orange County", "Anna of the North"], "image": "https://i.scdn.co/image/ab67616d000048518940ac99f49e44f59e6f7fb3" }]

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
  }))
  tracks.forEach((track) => trackStore.AddTrack(track))
  layoutStore.calculateLayout()
})

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