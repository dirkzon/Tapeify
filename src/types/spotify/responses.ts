import type { AlbumDTO, AlbumPaginationDTO, AlbumTracksPaginationDTO, PlaylistDTO, PlaylistPaginationDTO, PlaylistTracksPaginationDTO } from "./dto"

export interface UsersPlaylistsResponse extends PlaylistPaginationDTO {}

export interface GetPlaylistsResponse extends PlaylistDTO {
    tracks: PlaylistTracksPaginationDTO 
}

export interface GetAlbumResponse extends AlbumDTO {
    tracks: AlbumTracksPaginationDTO
}

export interface GetPlaylistTracksResponse extends PlaylistTracksPaginationDTO {}

export interface GetAlbumTracksResponse extends AlbumTracksPaginationDTO {}

export interface SearchResponse {
    albums: AlbumPaginationDTO
    playlists: PlaylistPaginationDTO
}