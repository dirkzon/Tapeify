import type { AlbumDTO, AlbumTracksPaginationDTO, PaginationDTO, PlaylistDTO, PlaylistTracksPaginationDTO } from "./dto"

export interface UsersPlaylistsResponse extends PaginationDTO {
    items: PlaylistDTO[]
    public: Boolean
}

export interface GetPlaylistsResponse extends PlaylistDTO{
    tracks: PlaylistTracksPaginationDTO 
}

export interface GetAlbumResponse extends AlbumDTO {
    tracks: AlbumTracksPaginationDTO
}

export interface GetPlaylistTracksResponse extends PlaylistTracksPaginationDTO {}