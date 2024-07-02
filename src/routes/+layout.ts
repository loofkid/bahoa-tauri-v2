import type { LayoutLoad } from "./$types";
import { io } from "socket.io-client";

export const prerender = true
export const ssr = false

export const load: LayoutLoad = async ({ parent }) => {
    const parentData = await parent();
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
    socket.on("connect", () => {
        console.log("connected");
    });

    return {
        ...parentData,
        socket,
    }
}