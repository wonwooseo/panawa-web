<script lang="ts">
  import Chart from './Chart.svelte';
  import { onMount } from 'svelte';
  import { SUPPORTED_REGIONS } from './lib/const';
  import { fetchPriceData, fetchPriceTrendData, fetchRegionalMarketPriceData } from './lib/api';

  let priceData: any = null;
  let priceTrendData: any = null;
  let regionalMarketPriceData: any = null;

  let chartLabels: string[] = [];
  let chartData: any[] = [];

  let selectedRegion: string = SUPPORTED_REGIONS[0];

  onMount(async () => {
    priceData = await fetchPriceData();
    priceTrendData = await fetchPriceTrendData();
    await updateRegionalMarketPrice(selectedRegion);

    let low: Number[] = [];
    let average: Number[] = [];
    let high: Number[] = [];
    priceTrendData.forEach((elem: any) => {
      chartLabels.push(elem.date);
      low.push(elem.low);
      average.push(elem.average);
      high.push(elem.high);
    });
    chartData = [
      {label: '최저', data: low, color: '#0000FF'},
      {label: '평균', data: average, color: '#000000'},
      {label: '최고', data: high, color: '#FF0000'},
    ];
  });

  async function updateRegionalMarketPrice(region: string) {
    regionalMarketPriceData = await fetchRegionalMarketPriceData(selectedRegion);
    regionalMarketPriceData = Object.entries(regionalMarketPriceData); // convert to array
  }
</script>

<!-- Navbar -->
<nav class="navbar navbar-dark bg-dark fixed-top">
  <a class="navbar-brand" href="#">TEST</a>
</nav>

<div class="container main-content">
  <!-- price -->
  <div class="section">
    <h2>Section 1</h2>
    {#if priceData !== null}
      <ul>
        <li><span>최저: </span>{priceData.low}
        <li><span>평균: </span>{priceData.average}
        <li><span>최고: </span>{priceData.high}
      </ul>
      <span class="text-muted">업데이트 시간: {new Date(priceData.last_update_time).toLocaleString()}</span>
    {:else}
      <p>로딩 중...</p>
    {/if}
  </div>

  <!-- trend -->
  <div class="section">
    <h2>Section 2</h2>
    {#if priceTrendData !== null}
      <Chart labels={chartLabels} data={chartData} />
    {:else}
      <p>로딩 중...</p>
    {/if}
  </div>

  <!-- regional market prices -->
  <div class="section">
    <h2>Section 3</h2>
    {#if regionalMarketPriceData !== null}
      <select class="form-select" bind:value={selectedRegion} on:change={updateRegionalMarketPrice(selectedRegion)}>
      {#each SUPPORTED_REGIONS as region}
        <option value={region}>
          {region} <!-- locale name -->
        </option>
      {/each}
      </select>
      <table class="table">
        <thead>
          <tr>
            <th scope="col">분류</th>
            <th scope="col">최저</th>
            <th scope="col">평균</th>
            <th scope="col">최고</th>
          </tr>
        </thead>
        <tbody>
        {#each regionalMarketPriceData as [market, price]}
          <tr>
            <th scope="row">{market}</th>
            <td>{price.low}</td>
            <td>{price.average}</td>
            <td>{price.high}</td>
          </tr>
        {/each}
        </tbody>
      </table>
    {:else}
      <p>로딩 중...</p>
    {/if}
  </div>
</div>

<!-- Footer -->
<footer class="footer mt-auto py-3">
  <div class="container text-center">
    <span class="text-muted">Your Footer Content</span>
  </div>
</footer>
