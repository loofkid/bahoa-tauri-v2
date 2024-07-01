<script lang="ts">
    import "../app.css";
    import Icon from '@iconify/svelte';
    import { icons } from '@iconify-json/mdi';
    import { getIconData } from '@iconify/utils';

    const menuIcon = getIconData(icons, 'menu')!;
</script>

<div class="drawer min-h-full">
    <input type="checkbox" id="drawer-toggle" class="drawer-toggle">
    <div class="drawer-content min-h-full grid">
        <div class="w-16 min-h-full border-r border-primary">
            <label for="drawer-toggle" aria-label="open sidebar" class="drawer-button flex justify-center items-center w-16 h-16 btn btn-ghost"><Icon icon={menuIcon} width='3rem'></Icon></label>
        </div>
        <slot />
    </div>
    <div class="drawer-side">
        <label for="drawer-toggle" aria-label="close sidebar" class="drawer-overlay"></label>
        <ul class="menu bg-base-200 text-base-content min-h-full w-52 p-4 rounded-r-lg">
            <li><a class="h-12 flex justify-start items-center text-xl" href="/">Home</a></li>
            <li><a class="h-12 flex justify-start items-center text-xl" href="/settings">Settings</a></li>
        <ul>
    </div>
</div>