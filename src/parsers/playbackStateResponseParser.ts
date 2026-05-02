import type { GetPlaybackStateResponse } from "@/types/spotify/responses";
import type { PlaybackState } from "@/types/tapeify/models";

export function parsePlaybackResponse(playbackResponse: GetPlaybackStateResponse): PlaybackState {
    let track_id = undefined
    if (playbackResponse.item) {
        track_id = playbackResponse.item.id
    }
    return {
        progress_ms: playbackResponse.progress_ms,
        is_playing: playbackResponse.is_playing,
        volume: playbackResponse.device.volume_percent | 0,
        spotify_track_id: track_id
    }
}