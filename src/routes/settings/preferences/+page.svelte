<script lang="ts">
    import type { PageData } from './$types';
    import { onMount } from 'svelte';
    import { themeChange } from 'theme-change';

    onMount(() => {
        themeChange(false);
    });
    
    export let data: PageData;
</script>

<div class="flex flex-col gap-2">
    <div class="card bg-base-300 shadow-xl">
        <div class="card-body">
            <div class="card-title">customization</div>
            <button class="btn btn-ghost btn-block flex justify-start h-28">
                <label class="form-control w-full">
                    <div class="label">
                        <span class="label-text">theme</span>
                    </div>
                    <select class="select select-bordered w-full max-w-xs" data-choose-theme>
                        <option value="" data-act-class="ACTIVECLASS">default</option>
                        <option value="light" data-act-class="ACTIVECLASS">light</option>
                        <option value="dark" data-act-class="ACTIVECLASS">dark</option>
                        <option value="cupcake" data-act-class="ACTIVECLASS">cupcake</option>
                        <option value="bumblebee" data-act-class="ACTIVECLASS">bumblebee</option>
                        <option value="emerald" data-act-class="ACTIVECLASS">emerald</option>
                        <option value="corporate" data-act-class="ACTIVECLASS">corporate</option>
                        <option value="synthwave" data-act-class="ACTIVECLASS">synthwave</option>
                        <option value="retro" data-act-class="ACTIVECLASS">retro</option>
                        <option value="cyberpunk" data-act-class="ACTIVECLASS">cyberpunk</option>
                        <option value="valentine" data-act-class="ACTIVECLASS">valentine</option>
                        <option value="halloween" data-act-class="ACTIVECLASS">halloween</option>
                        <option value="garden" data-act-class="ACTIVECLASS">garden</option>
                        <option value="forest" data-act-class="ACTIVECLASS">forest</option>
                        <option value="aqua" data-act-class="ACTIVECLASS">aqua</option>
                        <option value="lofi" data-act-class="ACTIVECLASS">lofi</option>
                        <option value="pastel" data-act-class="ACTIVECLASS">pastel</option>
                        <option value="fantasy" data-act-class="ACTIVECLASS">fantasy</option>
                        <option value="wireframe" data-act-class="ACTIVECLASS">wireframe</option>
                        <option value="black" data-act-class="ACTIVECLASS">black</option>
                        <option value="luxury" data-act-class="ACTIVECLASS">luxury</option>
                        <option value="dracula" data-act-class="ACTIVECLASS">dracula</option>
                        <option value="cmyk" data-act-class="ACTIVECLASS">cmyk</option>
                        <option value="autumn" data-act-class="ACTIVECLASS">autumn</option>
                        <option value="business" data-act-class="ACTIVECLASS">business</option>
                        <option value="acid" data-act-class="ACTIVECLASS">acid</option>
                        <option value="lemonade" data-act-class="ACTIVECLASS">lemonade</option>
                        <option value="night" data-act-class="ACTIVECLASS">night</option>
                        <option value="coffee" data-act-class="ACTIVECLASS">coffee</option>
                        <option value="winter" data-act-class="ACTIVECLASS">winter</option>
                        <option value="dim" data-act-class="ACTIVECLASS">dim</option>
                        <option value="nord" data-act-class="ACTIVECLASS">nord</option>
                        <option value="sunset" data-act-class="ACTIVECLASS">sunset</option>
                    </select>
                </label>
            </button>
        </div>
    </div>
</div>