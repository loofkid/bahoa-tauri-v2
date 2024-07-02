<script lang="ts">
    import type { LayoutData } from './$types';
    import { page } from '$app/stores';
    
    export let data: LayoutData;

    console.log($page.route)

    $: splitRoute = $page.route.id!.split("/");
</script>

<div class="flex flex-col p-4 items-stretch flex-grow">
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
    <div class="flex flex-col flex-grow overflow-y-auto h-96 items-stretch overscroll-y-contain rounded-lg">
        <slot />
    </div>
</div>