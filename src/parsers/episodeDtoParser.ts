import type { EpisodeDTO } from "@/types/spotify/dto";
import type { Track } from "@/types/tapeify/models";
import { GetSmallestImage } from "@/utils/images/imageUtils";
import { v4 as uuidv4 } from 'uuid';

export function ParsePlaylistEpisodeDTO(episodeDTO: EpisodeDTO): Track {
    return {
        name: episodeDTO.name,
        spotifyId: episodeDTO.id,
        id: uuidv4(),
        uri: episodeDTO.uri,
        explicit: episodeDTO.explicit,
        durationMs: episodeDTO.duration_ms,
        artists: episodeDTO.album.artists.map(a => a.type),
        image: GetSmallestImage(episodeDTO.album.images)
    }
}