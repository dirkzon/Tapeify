import type { EpisodeDTO } from "@/types/spotify/dto";
import type { Track } from "@/types/tapeify/models";
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