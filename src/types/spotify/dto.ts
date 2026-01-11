export interface UserDTO {
    id: string
    display_name: string
    external_urls: ExternalUrlsDTO
}
  
export interface ImageDTO {
    url: string
    height: number
    width: number
}
  
export interface PlaylistDTO {
    href: string
    id: string
    images: ImageDTO[]
    name: string
    owner: UserDTO
    collaborative: Boolean
    external_urls: ExternalUrlsDTO
    description: string
}

export interface PlaylistItemDTO {
    added_by: UserDTO
    track: PlaylistTrackDTO | EpisodeDTO
}

export interface PlaylistTrackDTO extends TrackDTO {
    album: AlbumDTO
}

export interface TrackDTO {
    type: string
    artists: ArtistDTO[]
    duration_ms: number
    explicit: boolean
    id: string
    name: string
    uri: string
}

export interface AlbumDTO {
    type: string
    album_type: string
    total_tracks: number
    id: string
    images: ImageDTO[]
    name: string
    uri: string
    external_urls: { spotify: string }
    artists: ArtistDTO[]
}

export interface EpisodeDTO {
    type: string
    duration_ms: number
    explicit: boolean
    id: string
    uri: string
    album: AlbumDTO
    name: string
}

export interface ArtistDTO {
    type: string
    id: string
    name: string
    external_urls: ExternalUrlsDTO
}

export interface PlaylistTracksPaginationDTO extends PaginationDTO {
    items: PlaylistItemDTO[]
}

export interface AlbumTracksPaginationDTO extends PaginationDTO {
    items: TrackDTO[]
}

export interface PaginationDTO {
    next: string
    previous: string
    limit: number
    offset: number
    total: number
}

export interface AlbumPaginationDTO extends PaginationDTO {
    items: AlbumDTO[]
}

export interface PlaylistPaginationDTO extends PaginationDTO {
    items: PlaylistDTO[]
}

export interface ProfileDTO {
    type: string
    images: ImageDTO[]
    uri: string
    id: string
    display_name: string
    country: string
    external_urls: ExternalUrlsDTO
}

export interface ExternalUrlsDTO {
    spotify: string
}