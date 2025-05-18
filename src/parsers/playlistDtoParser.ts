import type { Playlist } from "@/stores/playlists";
import type { PlaylistDTO } from "@/types/spotify/dto";
import { GetSmallestImage } from "@/utils/images/imageUtils";

export function ParsePlaylistDTO(playlist: PlaylistDTO): Playlist {
    return {
        name: playlist.name,
        id: playlist.id,
        owner: playlist.owner.display_name,
        image: GetSmallestImage(playlist.images)
    }
}