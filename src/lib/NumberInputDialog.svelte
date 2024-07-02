<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import Icon from '@iconify/svelte';
    import { icons as materialSymbolsIcons } from '@iconify-json/material-symbols'
    import { getIconData } from '@iconify/utils';
    
    const backspaceIcon = getIconData(materialSymbolsIcons, "backspace")!;

    const dispatch = createEventDispatcher();

    export let validateFunction: (value: string) => boolean | string = (value) => true;

    let dialog: HTMLDialogElement;
    export let value: string;

    export const numberValue = parseFloat(value);

    const updateValue = (input: string) => {
        let newValue = value + input
        if (value == "0" && input != ".") {
            value = input;
            return;
        }
        if (input == "." && value.includes(".")) {
            return;
        }
        if (value == "" && input == ".") {
            value = "0.";
            return;
        }
        const validateResult = validateFunction(newValue);
        if (validateResult === true) {
            error = false;
        }
        else {
            if (validateResult === false) {
                error = "invalid input";
            }
            else {
                error = validateResult;
            }
        }
        value = newValue;
    }

    const backspaceValue = () => {
        let newValue = value.slice(0, -1);
        if (newValue.length == 0) {
            value = "0"
            return;
        }
        if (validateFunction(newValue) !== false) {
            error = false;
            value = newValue;
        }
        else {
            error = "invalid input";
        }
    }

    export let error: boolean | string = false;

    export let id: string;

    export let open = false;

    $: {
        if (dialog) {
            if (open) {
                validateFunction(value) === true ? error = false : error = validateFunction(value);
                dialog.showModal();
            }
            else {
                error = false;
                value = "0";
                dialog.close();
            
            }
        }
    }
</script>

<dialog id={id} class="modal" bind:this={dialog} on:close={() => {open = false; dispatch("close")}}>
    <div class="modal-box items-center w-96 h-5/6 max-h-full flex flex-col">
        <div class="tooltip-bottom tooltip-error" class:tooltip={error !== false} class:tooltip-open={error !== false} data-tip={error}>
            <input id="{id}-input" class="input w-full max-w-xs text-3xl text-center mb-4" tabindex="-1"
                class:input-error={error !== false} 
                class:input-bordered={error !== false}
                type="string" bind:value={value} />
        </div>
        <div class="flex-grow flex flex-col gap-2">
            <div class="my-1 flex w-full justify-center gap-2">
                <button on:click={() => updateValue("1")}><kbd class="btn btn-square btn-outline btn-lg">1</kbd></button>
                <button on:click={() => updateValue("2")}><kbd class="btn btn-square btn-outline btn-lg">2</kbd></button>
                <button on:click={() => updateValue("3")}><kbd class="btn btn-square btn-outline btn-lg">3</kbd></button>
            </div>
            <div class="my-1 flex w-full justify-center gap-2">
                <button on:click={() => updateValue("4")}><kbd class="btn btn-square btn-outline btn-lg">4</kbd></button>
                <button on:click={() => updateValue("5")}><kbd class="btn btn-square btn-outline btn-lg">5</kbd></button>
                <button on:click={() => updateValue("6")}><kbd class="btn btn-square btn-outline btn-lg">6</kbd></button>
            </div>
            <div class="my-1 flex w-full justify-center gap-2">
                <button on:click={() => updateValue("7")}><kbd class="btn btn-square btn-outline btn-lg">7</kbd></button>
                <button on:click={() => updateValue("8")}><kbd class="btn btn-square btn-outline btn-lg">8</kbd></button>
                <button on:click={() => updateValue("9")}><kbd class="btn btn-square btn-outline btn-lg">9</kbd></button>
            </div>
            <div class="my-1 flex w-full justify-center gap-2">
                <button on:click={() => backspaceValue()}><kbd class="btn btn-square btn-outline btn-lg"><Icon icon={backspaceIcon} /></kbd></button>
                <button on:click={() => updateValue("0")}><kbd class="btn btn-square btn-outline btn-lg">0</kbd></button>
                <button on:click={() => updateValue(".")}><kbd class="btn btn-square btn-outline btn-lg">.</kbd></button>
            </div>
        </div>
        <div class="modal-action w-full flex justify-center items-center">
            <button class="btn btn-primary" on:click={() => dispatch("set")}>set</button>
            <button class="btn btn-error" on:click={() => dispatch("cancel")}>cancel</button>
        </div>
    </div>
    <form method="dialog" class="modal-backdrop">
        <button>close</button>
    </form>
</dialog>