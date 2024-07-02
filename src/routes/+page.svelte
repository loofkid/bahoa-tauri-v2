<script lang="ts">
    import type { PageData } from "./$types";
    import { onMount } from "svelte";
    import { beforeNavigate } from "$app/navigation";
    import NumberInputDialog from "$lib/NumberInputDialog.svelte";
    export let data: PageData;

    const socket = data.socket;

    const unit = "ºF";

    interface ProbeData {
        id: string;
        name: string;
        tempC: number;
        tempF: number;
        tempK: number;
        setTempK: number;
        setTempC: number;
        setTempF: number;
    }

    let probes: ProbeData[] = [
        {
            id: "probe-0",
            name: "smoker",
            tempC: 0.0,
            tempF: 0.0,
            tempK: 0.0,
            setTempK: 0.0,
            setTempC: 0.0,
            setTempF: 0.0,
        },
    ];

    onMount(() => {
        const enc = new TextDecoder("utf-8")

        socket.on("probe", (data) => {
            const decodedData: ProbeData = JSON.parse(enc.decode(new Uint8Array(data)));
            console.log(decodedData);
            if (probes.find(p => p.id == decodedData.id)) {
                probes = probes.map(p => {
                    if (p.id == decodedData.id) {
                        return decodedData;
                    }
                    return p;
                });
                return;
            }
            else {
                probes = [decodedData, ...probes];
            }
            probes.sort((a, b) => {
                const probeNumber = parseInt(a.id.split("-")[1]);
                return probeNumber - parseInt(b.id.split("-")[1]);
            })
        });
    });

    beforeNavigate(() => {
        socket.off("probe");
    });

    let showSetTempDialog = false;

    let setTempValue = "0";
    let setTempError: boolean | string = false;

    const validateSetTempValue = (value: string) => {
        if (!value.match(/^\d{0,3}\.?\d*$/))
            return "invalid input";
        if (parseFloat(value) > maxTemp) {
            return `temperature must be below ${maxTemp} ${unit}.`;
        }
        if (parseFloat(value) < minTemp) {
            return `temperature must be above ${minTemp} ${unit}.`;
        }
        return true;
    }

    const maxTemp = 375;
    const minTemp = 0;

    let currentProbeId: string;

    const applyTemp = () => {
        const probe = probes.find(p => p.id == currentProbeId);
        if (probe) {
            const validateResult = validateSetTempValue(setTempValue);
            if (validateResult !== true) {
                setTempError = validateResult;
                return;
            }
            const setTempF = parseFloat(setTempValue);
            const setTempK = setTempValue === "-459.67" ? 0 : (setTempF - 32) * (5 / 9) + 273.15;
            socket.emit("setTemp", {
                ProbeId: probe.id,
                SetTemp: setTempK,
            });
            setTempValue = "0"
            showSetTempDialog = false;
        }
    }

    const zeroTemp = () => {
        const probe = probes.find(p => p.id == currentProbeId);
        if (probe) {
            const setTempK = 0;
            socket.emit("setTemp", {
                ProbeId: probe.id,
                SetTemp: setTempK,
            });
            setTempValue = "0"
            showSetTempDialog = false;
        }
    }
</script>

<div class="grid grid-flow-row-dense flex-grow">
    <div class="stats [grid-template-columns:7fr_5fr]">
        <div class="stat bg-base-200 place-items-center place-content-center gap-6">
            <div class="stat-title">{ probes.find(p => p.id == "probe-0")?.name } temperature</div>
            <div class="stat-value text-8xl">{ probes.find(p => p.id == "probe-0")?.tempF.toFixed(1) } {unit}</div>
        </div>
        <div class="stat bg-base-200 min-w-full place-items-center place-content-center gap-6">
            <div class="stat-desc">set temperature of the smoker</div>
            <div class="stat-value text-5xl">{ probes.find(p => p.id == "probe-0")?.setTempF !== 0.0 ? 
                                `${probes.find(p => p.id == "probe-0")?.setTempF.toFixed(1)} ${unit}` :
                                "not set" }</div>
            <div class="stat-actions">
                <button class="btn btn-primary btn-md text-lg" on:click={() => {currentProbeId = "probe-0"; 
                                                     const probe = probes.find(p => p.id == "probe-0");
                                                     setTempValue = probe && probe.setTempF == 0 ? "0" :
                                                     probe ? probe.setTempF.toFixed(1).toString() : "0"; 
                                                     showSetTempDialog = true}}>set temp</button>
                <button class="btn btn-error btn-md text-lg" on:click={() => {currentProbeId = "probe-0"; zeroTemp()}}>turn off</button>
            </div>
        </div>
    </div>
    {#if probes.length > 1}
    <div class="stats h-56">
        {#each probes.slice(1) as probe}
        <div class="stat bg-base-200 place-items-center place-content-center gap-6">
        </div>
        {/each}
    </div>
    {/if}
</div>
<NumberInputDialog id="setTempDialog" bind:value={setTempValue} bind:open={showSetTempDialog}
    bind:error={setTempError}
    on:cancel={() => {setTempValue = "0"; showSetTempDialog = false}}
    on:set={applyTemp}
    validateFunction={validateSetTempValue} />