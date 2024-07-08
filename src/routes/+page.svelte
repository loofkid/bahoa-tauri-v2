<script lang="ts">
    import type { PageData } from "./$types";
    import { onMount } from "svelte";
    import { beforeNavigate } from "$app/navigation";
    import NumberInputDialog from "$lib/NumberInputDialog.svelte";
    import { db } from "$lib/db";
    import { liveQuery } from "dexie";
    import { default as dayjs } from 'dayjs';
    import ProbeChart from "$lib/ProbeChart.svelte";
	import { writable, type Writable } from "svelte/store";

    export let data: PageData;

    const socket = data.socket;
    // const tailwindConfig = data.tailwindConfig;

    // console.log(tailwindConfig);

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

    let readingSkip = 0;

    let historicalData: Writable<{probeId: string, timestamp: Date, temperature: number, setTemperature: number}[]> = writable([]);

    onMount(() => {
        const enc = new TextDecoder("utf-8")

        if (socket.connected) {
            socket.on("probe", async (data) => {
                const decodedData: ProbeData = JSON.parse(enc.decode(new Uint8Array(data)));
                // if (readingSkip < 5) {
                //     readingSkip++;
                // }
                // else {
                //     readingSkip = 0;
                    // await db.probeReadings.add({
                    //     probeId: decodedData.id,
                    //     timestamp: new Date(),
                    //     temperature: decodedData.tempK,
                    //     setTemperature: decodedData.setTempK,
                    // });
                    // $historicalData = [...$historicalData.filter(r => r.timestamp > dayjs().subtract(30, 'minutes').toDate()), {
                    //     probeId: decodedData.id,
                    //     timestamp: new Date(),
                    //     temperature: decodedData.tempK,
                    //     setTemperature: decodedData.setTempK,
                    // }];
                // }
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

            socket.on('probeRecords', async (data) => {
                $historicalData = data.map((d: {timestamp: number, probeId: string, temperature: number, setTemperature: number}) => {
                    return {
                        probeId: d.probeId,
                        timestamp: new Date(d.timestamp),
                        temperature: d.temperature,
                        setTemperature: d.setTemperature,
                    }
                });
            })
        }
        else {
            socket.on("connected", () => {
                socket.on("probe", async (data) => {
                    const decodedData: ProbeData = JSON.parse(enc.decode(new Uint8Array(data)));
                    // if (readingSkip < 5) {
                    //     readingSkip++;
                    // }
                    // else {
                    //     readingSkip = 0;
                        // await db.probeReadings.add({
                        //     probeId: decodedData.id,
                        //     timestamp: new Date(),
                        //     temperature: decodedData.tempK,
                        //     setTemperature: decodedData.setTempK,
                        // });
                        // $historicalData = [...$historicalData.filter(r => r.timestamp > dayjs().subtract(30, 'minutes').toDate()), {
                        //     probeId: decodedData.id,
                        //     timestamp: new Date(),
                        //     temperature: decodedData.tempK,
                        //     setTemperature: decodedData.setTempK,
                        // }];
                    // }
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

                socket.on('probeRecords', async (data) => {
                    $historicalData = data.map((d: {timestamp: number, probeId: string, temperature: number, setTemperature: number}) => {
                        return {
                            probeId: d.probeId,
                            timestamp: new Date(d.timestamp),
                            temperature: d.temperature,
                            setTemperature: d.setTemperature,
                        }
                    });
                })
            });
        }
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

    // $: probe0ChartData = liveQuery(async () => {
    //     console.log("fetching probe-0 data")
    //     const readings = await db.probeReadings
    //         .where('probeId')
    //         .equals('probe-0')
    //         .and(r => r.timestamp > dayjs().subtract(5, 'minutes').toDate())
    //         .toArray();

    //     const parsedTimestamps = readings.map(r => r.timestamp);
    //     const parsedReadings = readings.map(r => (r.temperature - 273.15) * 9 / 5 + 32);
    //     const parsedSetTemps = readings.map(r => r.setTemperature == 0 ? 0 : (r.setTemperature - 273.15) * 9 / 5 + 32);

    //     return {readings: parsedReadings, timestamps: parsedTimestamps, setTemps: parsedSetTemps};
    // });
    let probe0ChartData: Writable<{readings: number[], timestamps: Date[], setTemps: number[]}> = writable({
        readings: [],
        timestamps: [],
        setTemps: [],
    })
    $: { 
        const filteredHistoricalData = $historicalData.filter(r => r.probeId == "probe-0");

        const parsedTimestamps = filteredHistoricalData.map(r => r.timestamp);
        const parsedReadings = filteredHistoricalData.map(r => (r.temperature - 273.15) * 9 / 5 + 32);
        const parsedSetTemps = filteredHistoricalData.map(r => r.setTemperature == 0 ? 0 : (r.setTemperature - 273.15) * 9 / 5 + 32);

        $probe0ChartData = {readings: parsedReadings, timestamps: parsedTimestamps, setTemps: parsedSetTemps};
    }

    console.log($probe0ChartData);
</script>

<div class="flex flex-col flex-grow">
    <div class="stats [grid-template-columns:7fr_5fr] flex-grow">
        <div class="stat bg-base-200 place-items-center place-content-center gap-6">
            <div class="stat-title">{ probes.find(p => p.id == "probe-0")?.name } temperature</div>
            <div class="stat-value text-8xl">{ probes.find(p => p.id == "probe-0")?.tempF.toFixed(1) } {unit}</div>
            <div>
                <ProbeChart data={$probe0ChartData} 
                    readingColor="#ef4444"
                    setTempColor="#3b82f6"
                    unit={unit} />
            </div>
        </div>
        <div class="stat bg-base-200 min-w-full place-items-center place-content-center gap-6">
            <div class="stat-desc">set temperature of the smoker</div>
            <div class="stat-value text-5xl flex flex-col justify-center items-center">
                { probes.find(p => p.id == "probe-0")?.setTempF !== 0.0 ? 
                    `${probes.find(p => p.id == "probe-0")?.setTempF.toFixed(1)} ${unit}` :
                    "not set" }
            </div>
            <div class="stat-actions flex justify-evently gap-2">
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
    <div class="stats">
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