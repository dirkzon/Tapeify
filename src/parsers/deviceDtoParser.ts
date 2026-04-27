import type { DeviceDTO } from "@/types/spotify/dto";
import { type Device, type DeviceType } from "@/types/tapeify/models";

export function parseDeviceDTO(device: DeviceDTO): Device {
    return {
        id: device.id,
        is_active: device.is_active,
        name: device.name,
        type: device.type,
        icon: deviceTypeToIcon(device.type)
    };
}

export function deviceTypeToIcon(type: string): string {
    const t = type.toLowerCase();

    switch (t) {
        case "computer":
            return "mdi-desktop-classic";
        case "smartphone":
            return "mdi-cellphone";
        case "tablet":
            return "mdi-tablet";
        case "speaker":
            return "mdi-speaker";
        case "avr":
            return "mdi-audio-video";
        case "tv":
            return "mdi-television";
        case "stb":
            return "mdi-set-top-box";
        case "audiodongle":
            return "mdi-headphones";
        case "gameconsole":
            return "mdi-gamepad-variant";
        case "castvideo":
            return "mdi-cast";
        case "castaudio":
            return "mdi-cast-audio";
        case "automobile":
            return "mdi-car";
        case "unknown":
        default:
            return "mdi-help-circle";
    }
}