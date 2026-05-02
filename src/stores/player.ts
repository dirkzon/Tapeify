import { apiClient } from "@/api/clients";
import { parseDeviceDTO } from "@/parsers/deviceDtoParser";
import { parsePlaybackResponse } from "@/parsers/playbackStateResponseParser";
import type { DeviceDTO } from "@/types/spotify/dto";
import type { GetAvailableDevicesResponse, GetPlaybackStateResponse } from "@/types/spotify/responses";
import type { Device, PlaybackState } from "@/types/tapeify/models";
import { defineStore } from "pinia";
import { useLayoutStore } from "./layout";

export const usePlayerStore = defineStore('player', {
    state: () => ({
        available_devices: [] as Array<Device>,
        selected_device: undefined as string | undefined,
        spotify_playback_state: undefined as PlaybackState | undefined,
        playing_track_id: undefined as string | undefined
    }),
    actions: {
        async fetchAvailableDevices() {
            const response = await apiClient.get<GetAvailableDevicesResponse>(
                "/me/player/devices",
            );
            const devices = response.data.devices.map((device: DeviceDTO) => { return parseDeviceDTO(device) })
            this.available_devices = devices
            this.setActiveDevice()
        },
        setActiveDevice() {
            this.available_devices.forEach((device) => {
                if (device.is_active) {
                    this.selected_device = device.id
                }
            })
        },
        async transferPlayback() {
            if (this.selected_device == undefined) {
                return
            }
            const body = JSON.stringify({
                device_ids: [this.selected_device],
            });
            await apiClient.put<GetAvailableDevicesResponse>("/me/player", body);
        },
        async fetchPlaybackState() {
            const response = await apiClient.get<GetPlaybackStateResponse | "">(
                "/me/player",
            );
            if (response.data !== "") {
                this.spotify_playback_state = parsePlaybackResponse(response.data)
            }
        },
        async pausePlayback() {
            if (!this.spotify_playback_state) return
            if (!this.spotify_playback_state.is_playing) {
                return
            }
            const body = JSON.stringify({
                device_ids: [this.selected_device],
            });
            await apiClient.put<GetAvailableDevicesResponse>("/me/player/pause", body);
        },
        async playTrack(trackId: string) {
            const layoutStore = useLayoutStore()
            const trackIndex = layoutStore.orderedTracks.indexOf(trackId)
            if (trackIndex === -1) return
            const tracksLength = layoutStore.orderedTracks.length
            const tracksToPlay = layoutStore.orderedTracks.slice(trackIndex, tracksLength + 1)

        }
    }
})
