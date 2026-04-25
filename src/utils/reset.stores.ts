import { useCassettesStore } from "@/stores/cassette";
import { useLayoutStore } from "@/stores/layout";
import { useTracksStore } from "@/stores/tracks";

export function resetStores() {
    const cassetteStore = useCassettesStore()
    const layoutStore = useLayoutStore()
    const trackStore = useTracksStore()

    cassetteStore.$reset()
    layoutStore.$reset()
    trackStore.$reset()
}