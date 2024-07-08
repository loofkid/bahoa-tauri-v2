<script lang="ts">
    import "../app.css";
    import Icon from '@iconify/svelte';
    import WifiStatus from "$lib/WifiStatus.svelte";
    // import { icons as mdiIcons } from '@iconify-json/mdi';
    // import { getIconData } from '@iconify/utils';
    import { getIcon } from "$lib/icons";
    import type { LayoutData } from './$types';
    import { onMount } from "svelte";
    import { page } from "$app/stores";

    import { appWindow } from '@tauri-apps/api/window';

    export let data: LayoutData;

    const socket = data.socket;

    const wlan = data.wlan;

    let backendDisconnected = false;

    onMount(async () => {
        await appWindow.hide();
        await appWindow.show();

        if (!socket.connected) {
            backendDisconnected = true;
            backendDisconnectedDialog?.showModal();
        }

        socket.on("disconnect", () => {
            console.log("disconnected from backend");
            backendDisconnected = true;
            backendDisconnectedDialog?.showModal();
        });
        socket.on("connect_error", () => {
            console.log("error connecting to backend");
            backendDisconnected = true;
            backendDisconnectedDialog?.showModal();
        });
        socket.on("reconnect_attempt", () => {
            console.log("attempting to reconnect");
            backendDisconnected = true;
            backendDisconnectedDialog?.showModal();
        });
        socket.on("connect", () => {
            backendDisconnected = false;
            backendDisconnectedDialog?.close();
        });
        socket.on("reconnect", () => {
            console.log("reconnected to backend");
            backendDisconnected = false;
            backendDisconnectedDialog?.close();
        });
    });

    let backendDisconnectedDialog: HTMLDialogElement;

    let wifiDisconnected = false

    const menuIcon = getIcon("menu");

    let showDrawer = false

    // $: console.log($wlan)
</script>

<div class="drawer min-h-full max-h-full min-w-full overflow-y-hidden overscroll-none">
    <input type="checkbox" id="drawer-toggle" bind:checked={showDrawer} class="drawer-toggle">
    <div class="drawer-content min-h-full min-w-full flex overflow-y-hidden">
        <div class="w-20 min-h-full border-r border-primary flex flex-col">
            <label for="drawer-toggle" aria-label="open sidebar" class="drawer-button flex justify-center items-center w-20 h-20 btn btn-ghost"><Icon icon={menuIcon} width='4rem'></Icon></label>
            <div class="flex-grow"></div>
            <a class="btn btn-ghost btn-square h-20 w-20" href="/settings/network">
                <WifiStatus signalStrength={$wlan?.Signal} disconnected={wifiDisconnected}></WifiStatus>
            </a>
        </div>
        <div class="flex-grow flex">
            <slot />
        </div>
    </div>
    <div class="drawer-side">
        <label for="drawer-toggle" aria-label="close sidebar" class="drawer-overlay"></label>
        <ul class="menu bg-base-200 text-base-content min-h-full w-52 p-4 rounded-r-lg gap-2">
            <li><a class="h-12 flex justify-start items-center text-xl btn btn-outline btn-primary" on:click={() => showDrawer = false} href="/">dashboard</a></li>
            <li><a class="h-12 flex justify-start items-center text-xl btn btn-outline btn-primary" on:click={() => showDrawer = false} href="/settings">settings</a></li>
            <li class="flex-grow "><div></div></li>
            <!-- <li class="flex justify-center">
                <label class="grid cursor-pointer gap-2 place-items-center place-content-center">
                    <Icon icon={lightIcon} width='2rem'></Icon>
                    <input type="checkbox" value="" class="toggle theme-controller justify-self-end place-self-center" />
                    <Icon icon={darkIcon} width='2rem'></Icon>
                </label>
            </li> -->
        <ul>
    </div>
</div>
<dialog class="modal" bind:this={backendDisconnectedDialog}>
    <div class="modal-box h-96 w-96">

    </div>
</dialog>