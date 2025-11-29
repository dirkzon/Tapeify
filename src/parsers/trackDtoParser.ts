import type { PlaylistTrackDTO, TrackDTO } from "@/types/spotify/dto";
import type { Track } from "@/types/tapeify/models";
import { GetSmallestImage } from "@/utils/images/imageUtils";

export function ParsePlaylistTrackDTO(track: PlaylistTrackDTO): Track {
    return {
        name: track.name,
        id: track.id,
        uri: track.uri,
        explicit: track.explicit,
        durationMs: track.duration_ms,
        artists: track.artists.map(a => a.name),
        image: GetSmallestImage(track.album.images)
    }
}

export function ParseAlbumTrackDTO(track: TrackDTO, albumImage: URL | undefined): Track {
    return {
        name: track.name,
        id: track.id,
        uri: track.uri,
        explicit: track.explicit,
        durationMs: track.duration_ms,
        artists: track.artists.map(a => a.name),
        image: albumImage
    }
}  
