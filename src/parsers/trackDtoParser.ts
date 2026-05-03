import type { PlaylistTrackDTO, TrackDTO } from "@/types/spotify/dto";
import type { Track } from "@/types/tapeify/models";
import { GetSmallestImage } from "@/utils/images/imageUtils";
import { v4 as uuidv4 } from 'uuid';

export function ParsePlaylistTrackDTO(track: PlaylistTrackDTO, playlistId: string): Track {
    return {
        name: track.name,
        spotifyId: track.id,
        id: uuidv4(),
        uri: track.uri,
        explicit: track.explicit,
        durationMs: track.duration_ms,
        artists: track.artists.map(a => a.name),
        image: GetSmallestImage(track.album.images),
        origin: playlistId
    }
}

export function ParseAlbumTrackDTO(track: TrackDTO, albumImage: URL | undefined, albumId: string): Track {
    return {
        name: track.name,
        spotifyId: track.id,
        id: uuidv4(),
        uri: track.uri,
        explicit: track.explicit,
        durationMs: track.duration_ms,
        artists: track.artists.map(a => a.name),
        image: albumImage,
        origin: albumId
    }
}  
