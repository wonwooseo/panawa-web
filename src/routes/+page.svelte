<script lang="ts">
  import { onMount } from 'svelte';
  import type { PageData } from './$types';
  import { invalidate } from '$app/navigation';
  import LL, { setLocale } from '$lib/i18n/i18n-svelte'
  import { loadLocaleAsync } from '$lib/i18n/i18n-util.async'
  import logo from '$lib/assets/icons8-leek-100.png';
  import { SUPPORTED_REGIONS } from '$lib/const';
  import './app.css';
  import Chart from './Chart.svelte';

  export let data: PageData;

  // reactive
  var regionalMarketPrice: [string, number][];
  $: regionalMarketPrice = Object.entries(data.regional);

  var chartLabels: string[] = [];
  var chartData: any[] = [];
  var selectedRegion: string = SUPPORTED_REGIONS[0];

  // initial locale detection
  var lang = 'ko';

  onMount(async () => {
    const search = new URLSearchParams(window.location.search);
    if (search.get('lang') === 'en') {
      lang = 'en';
    }
    await switchLocale(lang);

    var low: Number[] = [];
    var average: Number[] = [];
    var high: Number[] = [];
    data.trend.forEach((elem: any) => {
      chartLabels.push(elem.date);
      low.push(elem.low);
      average.push(elem.average);
      high.push(elem.high);
    });
    chartData = [
      {label: $LL.PRICE_LOW(), data: low, color: '#0000FF'},
      {label: $LL.PRICE_AVERAGE(), data: average, color: '#000000'},
      {label: $LL.PRICE_HIGH(), data: high, color: '#FF0000'},
    ];
  });

  async function switchLocale(lang: string) {
    await loadLocaleAsync(lang);
    setLocale(lang);
  }

  async function updateRegionalMarketPrice(region: string) {
    const resp = await fetch(`/api/price/region?region_code=${region}&date_unix=${data.price.date_unix}`);
    const price = await resp.json();
    regionalMarketPrice = Object.entries(price);
  }
</script>

<!-- Navbar -->
<nav class="navbar navbar-dark bg-dark fixed-top">
  <a class="navbar-brand" href="#/">
      <img class="logo-img" src={logo} alt="logo" />
      <span class="logo-text" >PANAWA</span>
  </a>
</nav>

<div class="d-flex flex-column min-vh-100 container main-content">
  <!-- price -->
  <div class="section" id="price">
    <h2>{$LL.TITLE_PRICE()}</h2>
    <ul>
      <li><span>{$LL.PRICE_LOW()}: </span>{data.price.low}
      <li><span>{$LL.PRICE_AVERAGE()}: </span>{data.price.average}
      <li><span>{$LL.PRICE_HIGH()}: </span>{data.price.high}
    </ul>
    <span class="text-muted">{$LL.UPDATETIME()}: {new Date(data.price.last_update_time).toLocaleString()}</span>
  </div>

  <!-- trend -->
  <div class="section" id="trend">
    <h2>{$LL.TITLE_TREND()}</h2>
    <Chart labels={chartLabels} data={chartData} />
  </div>

  <!-- regional market prices -->
  <div class="section" id="regional_market_price">
    <h2>{$LL.TITLE_REGIONALMARKETPRICE()}</h2>
    <select class="form-select" bind:value={selectedRegion} on:change={() => updateRegionalMarketPrice(selectedRegion)}>
      {#each SUPPORTED_REGIONS as region}
      <option value={region}>
        {$LL.MAP_REGION[region]()} <!-- locale name -->
      </option>
      {/each}
    </select>
    <table class="table">
      <thead>
        <tr>
          <th scope="col">{$LL.MARKETTYPE()}</th>
          <th scope="col">{$LL.PRICE_LOW()}</th>
          <th scope="col">{$LL.PRICE_AVERAGE()}</th>
          <th scope="col">{$LL.PRICE_HIGH()}</th>
        </tr>
      </thead>
      <tbody>
        {#each regionalMarketPrice as [market, price]}
        <tr>
          <th scope="row">{$LL.MAP_MARKET[market]()}</th>
          <td>{price.low}</td>
          <td>{price.average}</td>
          <td>{price.high}</td>
        </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

<!-- Footer -->
<footer class="footer mt-auto py-3">
<div class="container d-flex flex-column text-center">
    <div class="p-1">
    {#if lang === 'ko'}
    <a href="?lang=en">Panawa in English</a>
    {:else}
    <a href="/">Panawa in Korean</a>
    {/if}
    </div>
    <div class="p-1">
    <a href="https://github.com/wonwooseo/panawa-web" target='_blank' rel='noopener noreferrer'>
        <i class="fa fa-github" style="font-size:24px; color:white"></i>
    </a>
    </div>
</div>
</footer>
