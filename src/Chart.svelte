<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { Chart, LineController, LineElement, PointElement, CategoryScale, LinearScale, Legend, Tooltip } from 'chart.js';

  export let labels : string[];
  export let data : [{label: string, data: Number[]}];

  Chart.register(LineController, LineElement, PointElement, CategoryScale, LinearScale, Legend, Tooltip);
  let chartInstance: any;
  let calculatedDataSet: any[] = [];

  $: if (chartInstance && labels.length && data.length) {
    data.forEach(elem => {
      calculatedDataSet.push({
        label: elem.label,
        data: elem.data,
        fill: false,
        tension: 0.1,
        borderColor: elem.color,
      })
    });
    chartInstance.update();
  }

  onMount(() => {
    const ctx = document.getElementById('chart').getContext('2d');
    chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: calculatedDataSet
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        },
        interaction: {
          mode: 'index',
          intersect: false,
          axis: 'xy'
        },
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              color: '#000000'
            }
          }
        }
      }
    });
  });

  onDestroy(() => {
    if (chartInstance) {
      chartInstance.destroy();
    }
  });
</script>

<canvas id="chart"></canvas>
