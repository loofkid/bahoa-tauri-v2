<script lang="ts">
    import type { LayoutData } from './$types';
    import { page } from '$app/stores';
    
    export let data: LayoutData;

    console.log($page.route)

    $: splitRoute = $page.route.id!.split("/");
</script>

<div class="flex flex-col p-4 items-stretch flex-grow overflow-y-hidden">
    <div class="breadcrumbs text-xl">
        <ul>
            {#each splitRoute as segment, i}
                <li>
                    <a href="{splitRoute.slice(0, i).join("/")}/{segment}" class="text-xl">{segment}</a>
                </li>
            {/each}
        </ul>
    </div>
    <div class="divider"></div>
    <div class="flex flex-col flex-grow h-64 items-stretch overscroll-y-contain rounded-lg overflow-y-auto">
        <slot />
    </div>
</div>