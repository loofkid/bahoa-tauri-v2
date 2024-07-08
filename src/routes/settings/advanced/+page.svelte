<script lang="ts">
	import { onMount } from 'svelte';
    import type { PageData } from './$types';
    import { beforeNavigate } from "$app/navigation";
    import NumberInputDialog from '$lib/NumberInputDialog.svelte';
    
    export let data: PageData;

    const socket = data.socket;

    let pid: {
        p: number,
        i: number,
        d: number,
    } = {
        p: 0,
        i: 0,
        d: 0,
    }

    let dutyCyclePeriod = 0;

    onMount(async () => {
        socket.on("PID", (data) => {
            console.log(data)
            pid = data;
        })
        socket.emit("getPID");

        socket.on("dutyCyclePeriod", (data) => {
            console.log(data)
            dutyCyclePeriod = data;
        })
        socket.emit("getDutyCyclePeriod");
    });

    beforeNavigate(() => {
        socket.off("PID");
        socket.off("dutyCyclePeriod");
    });

    let validateFunction: (value: string) => string | boolean = (value) => true;
    let setFunction = () => {};

    let numberInputValue = "0";
    let showNumberInput = false;
    let numberInputError: string | boolean = false;

    let currentProperty: keyof typeof pid;

    const showPIDNumberInput = (property: keyof typeof pid) => {
        currentProperty = property;
        validateFunction = PIDValidateFunction;
        setFunction = setPIDFunction;
        const currentValue = pid[currentProperty].toString();
        numberInputValue = currentValue;
        showNumberInput = true;
    }

    const PIDValidateFunction = (value: string) => {
        if (isNaN(parseFloat(value))) {
            return "invalid input";
        }
        if (parseFloat(value) < 0) {
            return "value must be greater than 0";
        }
        return true;
    }

    const setPIDFunction = () => {
        pid[currentProperty] = parseFloat(numberInputValue);
        socket.emit("setPID", pid);
        closeNumberInput();
    }

    const showDutyCycleNumberInput = () => {
        validateFunction = dutyCycleValidateFunction;
        setFunction = setDutyCycleFunction;
        const currentValue = dutyCyclePeriod.toString();
        numberInputValue = currentValue;
        showNumberInput = true;
    }

    const dutyCycleValidateFunction = (value: string) => {
        if (isNaN(parseFloat(value))) {
            return "invalid input";
        }
        if (parseFloat(value) < 0) {
            return "value must be greater than 0";
        }
        return true;
    }

    const setDutyCycleFunction = () => {
        dutyCyclePeriod = parseFloat(numberInputValue);
        socket.emit("setDutyCyclePeriod", dutyCyclePeriod);
        closeNumberInput();
    }

    const closeNumberInput = () => {
        showNumberInput = false;
        numberInputValue = "0";
        setFunction = () => {};
    }
</script>

<div class="flex flex-col gap-2">
    <div class="card bg-base-300 shadow-xl">
        <div class="card-body">
            <h2 class="card-title">pid</h2>
            <button class="btn btn-ghost btn-block flex justify-start h-28" on:click={() => showPIDNumberInput("p")}>
                <label class="form-control w-full">
                    <div class="label">
                        <span class="label-text">proportional gain (P)</span>
                    </div>
                        <input type="text" readonly value={pid.p} class="input input-primary input-bordered" />
                </label>
            </button>
            <button class="btn btn-ghost btn-block flex justify-start h-28" on:click={() => showPIDNumberInput("i")}>
                <label class="form-control w-full">
                    <div class="label">
                        <span class="label-text">integral gain (I)</span>
                    </div>
                        <input type="text" readonly value={pid.i} class="input input-primary input-bordered" />
                </label>
            </button>
            <button class="btn btn-ghost btn-block flex justify-start h-28" on:click={() => showPIDNumberInput("d")}>
                <label class="form-control w-full">
                    <div class="label">
                        <span class="label-text">derivative gain (D)</span>
                    </div>
                        <input type="text" readonly value={pid.d} class="input input-primary input-bordered" />
                </label>
            </button>
        </div>
    </div>
    <div class="card bg-base-300 shadow-xl">
        <div class="card-body">
            <div class="card-title">duty cycle</div>
            <button class="btn btn-ghost btn-block flex justify-start h-28" on:click={() => showDutyCycleNumberInput()}>
                <label class="form-control w-full">
                    <div class="label">
                        <span class="label-text">period (in seconds)</span>
                    </div>
                        <input type="text" readonly value={dutyCyclePeriod} class="input input-primary input-bordered" />
                </label>
            </button>
        </div>
    </div>
</div>
<NumberInputDialog id="advancedInputDialog" 
    bind:value={numberInputValue} 
    bind:open={showNumberInput}
    bind:error={numberInputError}
    on:cancel={closeNumberInput}
    on:set={setFunction}
    validateFunction={validateFunction} />