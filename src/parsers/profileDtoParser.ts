import type { Profile } from "@/stores/profile";
import type { ProfileDTO } from "@/types/spotify/dto";
import { GetSmallestImage } from "@/utils/images/imageUtils";

export function ParseProfileDTO(profile: ProfileDTO): Profile {
    return {
        type: profile.type,
        image: GetSmallestImage(profile.images),
        uri: profile.uri,
        id: profile.id,
        display_name: profile.display_name,
        country: profile.country
    }
}