import { apiClient } from "@/api/clients";
import { parseDeviceDTO } from "@/parsers/deviceDtoParser";
import type { DeviceDTO } from "@/types/spotify/dto";
import type { GetAvailableDevicesResponse } from "@/types/spotify/responses";
import type { Device } from "@/types/tapeify/models";
import { defineStore } from "pinia";

export const usePlayerStore = defineStore('player', {
    state: () => ({
        available_devices: [] as Array<Device>,
        selected_device: undefined as string | undefined,
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
        }
    }
})
