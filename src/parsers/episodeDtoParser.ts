import type { Track } from "@/stores/tracks";
import type { EpisodeDTO } from "@/types/spotify/dto";
import { GetSmallestImage } from "@/utils/images/imageUtils";

export function ParsePlaylistEpisodeDTO(episodeDTO: EpisodeDTO): Track {
    return {
        name: episodeDTO.name,
        id: episodeDTO.id,
        uri: episodeDTO.uri,
        explicit: episodeDTO.explicit,
        duration_ms: episodeDTO.duration_ms,
        artists: episodeDTO.album.artists.map(a => a.type),
        anchored: false,
        image: GetSmallestImage(episodeDTO.album.images)
    }
}