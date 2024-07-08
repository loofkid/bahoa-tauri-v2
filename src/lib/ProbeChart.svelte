<script lang="ts">
    import { Line } from "svelte-chartjs";
    import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale } /* preval */ from 'chart.js';

    ChartJS.register(Legend, LineElement, LinearScale, PointElement, CategoryScale);

    export let data: {
        readings: number[];
        timestamps: Date[];
        setTemps: number[];
    }

    export let readingColor: string;
    export let setTempColor: string;
    console.log(readingColor, setTempColor)

    export let unit: string;

    $: timestamps = data ? data.timestamps ?? [] : [];
    $: readings = data ? data.readings ?? [] : [];
    $: setTemps = data ? data.setTemps ?? [] : [];

    $: console.log(data)

    $: chartData = {
        labels: timestamps,
        datasets: [
            {
                label: "Temperature",
                data: readings,
                borderColor: readingColor,
                tension: 0.1,
                pointRadius: 0,
            },
            {
                label: "Set Temperature",
                data: setTemps,
                borderColor: setTempColor,
                tension: 0.1,
                pointRadius: 0,
            },
        ],
    }
</script>
<div class="bg-base-300">
    <Line data={chartData} options={{ 
        maintainAspectRatio: false, 
        responsive: true,
        scales: {
            y: {
                ticks: {
                    callback: (value, index, ticks) => {
                        return `${value} ${unit}`;
                    },
                },
                suggestedMax: 250,
                suggestedMin: 200,

            },
            x: {
                ticks: {
                    display: false,
                }
            }
        },
        animation: false,
    }} />
</div>