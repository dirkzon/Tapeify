import type { EpisodeDTO } from "@/types/spotify/dto";
import type { Track } from "@/types/tapeify/models";
import { GetSmallestImage } from "@/utils/images/imageUtils";

export function ParsePlaylistEpisodeDTO(episodeDTO: EpisodeDTO): Track {
    return {
        name: episodeDTO.name,
        id: episodeDTO.id,
        uri: episodeDTO.uri,
        explicit: episodeDTO.explicit,
        durationMs: episodeDTO.duration_ms,
        artists: episodeDTO.album.artists.map(a => a.type),
        image: GetSmallestImage(episodeDTO.album.images)
    }
}