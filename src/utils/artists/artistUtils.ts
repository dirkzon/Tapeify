import type { AlbumDTO, EpisodeDTO, TrackDTO } from "@/types/spotify/dto";

export function GetTrackArists(track: TrackDTO): string[] {
    return track.artists.map(a => a.name)
}

export function GetEpisodeArtists(episode: EpisodeDTO): string[] {
    return episode.album.artists.map(a => a.type)
}

export function GetAlbumArtists(album: AlbumDTO): string[] {
    return album.artists.map(a => a.name)
}