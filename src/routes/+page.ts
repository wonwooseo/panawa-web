import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
  const respPrice = await fetch('/api/price');
  const price = await respPrice.json();

  const respTrend = await fetch('/api/price/trend?window=week');
  const trend = await respTrend.json();

  const respRegional = await fetch(`/api/price/region?region_code=0000&date_unix=${price.date_unix}`);
  const regional = await respRegional.json();

  return {
    price: price,
    trend: trend,
    regional: regional,
  }
}
