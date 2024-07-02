<script lang="ts">
    import "../app.css";
    import Icon from '@iconify/svelte';
    import { icons as mdiIcons } from '@iconify-json/mdi';
    import { icons as materialSymbolsIcons } from '@iconify-json/material-symbols'
    import { getIconData } from '@iconify/utils';
    import { onMount } from "svelte";

    import { appWindow } from '@tauri-apps/api/window';

    onMount(async () => {
        await appWindow.show();
    })

    const menuIcon = getIconData(mdiIcons, 'menu')!;
    const lightIcon = getIconData(materialSymbolsIcons, "light-mode")!;
    const darkIcon = getIconData(materialSymbolsIcons, "dark-mode")!;
</script>

<div class="drawer min-h-full max-h-full min-w-full overflow-y-hidden">
    <input type="checkbox" id="drawer-toggle" class="drawer-toggle">
    <div class="drawer-content min-h-full min-w-full flex">
        <div class="w-16 min-h-full border-r border-primary">
            <label for="drawer-toggle" aria-label="open sidebar" class="drawer-button flex justify-center items-center w-16 h-16 btn btn-ghost"><Icon icon={menuIcon} width='3rem'></Icon></label>
        </div>
        <div class="flex-grow flex">
            <slot />
        </div>
    </div>
    <div class="drawer-side">
        <label for="drawer-toggle" aria-label="close sidebar" class="drawer-overlay"></label>
        <ul class="menu bg-base-200 text-base-content min-h-full w-52 p-4 rounded-r-lg gap-2">
            <li><a class="h-12 flex justify-start items-center text-xl btn btn-outline btn-primary" href="/">home</a></li>
            <li><a class="h-12 flex justify-start items-center text-xl btn btn-outline btn-primary" href="/settings">settings</a></li>
            <li class="flex-grow "><div></div></li>
            <li class="flex justify-center">
                <label class="grid cursor-pointer gap-2 place-items-center place-content-center">
                    <Icon icon={lightIcon} width='2rem'></Icon>
                    <input type="checkbox" value="synthwave" class="toggle theme-controller justify-self-end place-self-center" />
                    <Icon icon={darkIcon} width='2rem'></Icon>
                </label>
            </li>
        <ul>
    </div>
</div>