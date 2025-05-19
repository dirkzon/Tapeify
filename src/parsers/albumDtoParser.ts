import type { AlbumDTO } from "@/types/spotify/dto";
import type { Album } from "@/types/tapeify/models";
import { GetSmallestImage } from "@/utils/images/imageUtils";

export function ParseAlbumDTO(album: AlbumDTO): Album {
    return {
        name: album.name,
        id: album.id,
        artists: album.artists.map(a => a.name),
        image: GetSmallestImage(album.images)
    }
}