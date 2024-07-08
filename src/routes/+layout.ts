import type { LayoutLoad } from "./$types";
import { io } from "socket.io-client";
import { type Writable, writable, get } from "svelte/store";
// import { browser } from "$app/environment";

// import resolveConfig from "tailwindcss/resolveConfig";
// import tailwindConfig from "./tailwind.config";

// import preval from 'preval.macro';

export const prerender = true
export const ssr = false

export const load: LayoutLoad = async ({ parent }) => {
    const parentData = await parent();

    // const fullConfig = preval`
    //     import("tailwindcss/resolveConfig.js").then(({default: resolveConfig}) => {
    //         import("../../tailwind.config.js").then(({default: tailwindConfig}) => {
    //             fullConfig = resolveConfig(tailwindConfig);
    //             module.exports = fullConfig;
    //         });
    //     });`;

    // const fullConfig = resolveConfig(tailwindConfig);
    
    let uri: string;
    if (window.location.href.startsWith("http://localhost")) {
        uri = "ws://localhost:3000"
    }
    else {
        uri = "https://pv4px63r-3000.use.devtunnels.ms/"
    }
    const socket = io(uri, {
        reconnectionDelayMax: 10000,
        reconnection: true,
        path: "/socket.io",
    });

    interface Wlan {
        ID: string
        SSID: string
        BSSID: string
        ESSID: string
        Mode: string
        KeyManagement: string
        WpaState: string
        IPAddress: string
        Address: string
        UUID: string
        GroupCipher: string
        PairwiseCipher: string
        RSSI: number
        Signal: number
        Frequency: number
    }

    const wlan: Writable<Wlan> = writable();
    socket.on("connect", () => {
        console.log("connected");

        socket.emit("joinRoom","pi");

        socket.on("wifi", (data) => {
            wlan.set(data)
            console.log(get(wlan))
        });
        socket.emit('getWifi', (data: Wlan) => {
            wlan.set(data);
            // console.log(get(wlan))
        });
    });

    return {
        ...parentData,
        socket,
        // tailwindConfig: fullConfig,
        wlan
    }
}