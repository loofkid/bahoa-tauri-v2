<script lang="ts">
    // import { icons as materialSymbolsIcons } /* preval */ from '@iconify-json/ic';
    // import { icons as mdiIcons } /* preval */ from '@iconify-json/mdi';
    // import { getIconData } from '@iconify/utils';
    import { getIcon } from "$lib/icons";
    import Icon from '@iconify/svelte';

    const wifiMinIcon = getIcon("outlineSignalWifiStatusbarNull")
    const wifi1Icon = getIcon("sharpWifi1Bar");
    const wifi2Icon = getIcon("sharpWifi2Bar");
    const wifi3Icon = getIcon("sharpWifi");
    const wifiOffIcon = getIcon("sharpWifiOff");
    
    const wifiSearchingIcon = getIcon("outlineWifiFind");

    const ethernetIcon = getIcon("ethernet");


    export let signalStrength: number = -99;
    export let minThreshold: number = -80;
    export let lowThreshold: number = -65;
    export let mediumThreshold: number = -50;
    // export let highThreshold: number = -40;
    export let off: boolean = false;
    export let disconnected: boolean = false;
    export let lan: boolean = false;

    console.log("signal strength:", signalStrength);
    if (off || signalStrength === undefined) {
        console.log("wifi off");
    }
    else if (disconnected) {
        console.log("wifi disconnected");
    }
    else if (lan) {
        console.log("connected to ethernet");
    }
    else if (signalStrength < minThreshold) {
        console.log("signal strength very weak");
    }
    else if (signalStrength < lowThreshold) {
        console.log("signal strength weak");
    }
    else if (signalStrength < mediumThreshold) {
        console.log("signal strength medium");
    }
    else {
        console.log("signal strength strong");
    }
</script>

<div class="flex justify-center items-center w-20">
    {#if off || signalStrength === undefined}
        <Icon icon={wifiOffIcon} width="3rem" id="wifiOffIcon" />
    {:else if disconnected}
        <Icon icon={wifiSearchingIcon} width="3rem" id="wifiSearchingIcon" />
    {:else if lan}
        <Icon icon={ethernetIcon} width="3rem" id="ethernetIcon" />
    {:else if signalStrength < minThreshold}
        <Icon icon={wifiMinIcon} width="3rem" id="wifiMinIcon" />
    {:else if signalStrength < lowThreshold}
        <Icon icon={wifi1Icon} width="3rem" id="wifi1Icon" />
    {:else if signalStrength < mediumThreshold}
        <Icon icon={wifi2Icon} width="3rem" id="wifi2Icon" />
    {:else}
        <Icon icon={wifi3Icon} width="3rem" id="wifi3Icon" />
    {/if}
</div>