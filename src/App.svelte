<script lang="ts">
  import LL, { setLocale } from './i18n/i18n-svelte'
  import { loadLocaleAsync } from './i18n/i18n-util.async'
  import Chart from './Chart.svelte';
  import { onMount } from 'svelte';
  import { SUPPORTED_REGIONS } from './lib/const';
  import { fetchPriceData, fetchPriceTrendData, fetchRegionalMarketPriceData } from './lib/api';
  import logo from './assets/icons8-leek-100.png';

  let priceData: any = null;
  let priceTrendData: any = null;
  let regionalMarketPriceData: any = null;

  let chartLabels: string[] = [];
  let chartData: any[] = [];

  let selectedRegion: string = SUPPORTED_REGIONS[0];

  // initial locale detection
  let lang = 'ko';
  let search = new URLSearchParams(window.location.search);
  if (search.get('lang') === 'en') {
    lang = 'en';
  }

  onMount(async () => {
    // set locale
    switchLocale(lang);

    // fetch data
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
    regionalMarketPriceData = await fetchRegionalMarketPriceData(selectedRegion);
    regionalMarketPriceData = Object.entries(regionalMarketPriceData); // convert to array
  }
</script>

<!-- Navbar -->
<nav class="navbar navbar-dark bg-dark fixed-top">
  <a class="navbar-brand" href="#">
    <img class="logo-img" src={logo} alt="logo" />
    <span class="logo-text" >PANAWA</span>
  </a>
</nav>

<div class="d-flex flex-column min-vh-100 container main-content">
  <!-- price -->
  <div class="section" id="price">
    <h2>{$LL.TITLE_PRICE()}</h2>
    {#if priceData !== null}
      <ul>
        <li><span>{$LL.PRICE_LOW()}: </span>{priceData.low}
        <li><span>{$LL.PRICE_AVERAGE()}: </span>{priceData.average}
        <li><span>{$LL.PRICE_HIGH()}: </span>{priceData.high}
      </ul>
      <span class="text-muted">{$LL.UPDATETIME()}: {new Date(priceData.last_update_time).toLocaleString()}</span>
    {:else}
      <p>{$LL.LOADING()}</p>
    {/if}
  </div>

  <!-- trend -->
  <div class="section" id="trend">
    <h2>{$LL.TITLE_TREND()}</h2>
    {#if priceTrendData !== null}
      <Chart labels={chartLabels} data={chartData} />
    {:else}
      <p>{$LL.LOADING()}</p>
    {/if}
  </div>

  <!-- regional market prices -->
  <div class="section" id="regional_market_price">
    <h2>{$LL.TITLE_REGIONALMARKETPRICE()}</h2>
    {#if regionalMarketPriceData !== null}
      <select class="form-select" bind:value={selectedRegion} on:change={updateRegionalMarketPrice(selectedRegion)}>
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
        {#each regionalMarketPriceData as [market, price]}
          <tr>
            <th scope="row">{$LL.MAP_MARKET[market]()}</th>
            <td>{price.low}</td>
            <td>{price.average}</td>
            <td>{price.high}</td>
          </tr>
        {/each}
        </tbody>
      </table>
    {:else}
      <p>{$LL.LOADING()}</p>
    {/if}
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
