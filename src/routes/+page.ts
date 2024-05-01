import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
  const price = await fetch('/api/price');
  const trend = await fetch('/api/price/trend?window=week');
  const regional = await fetch('/api/price/region?region_code=0000')

  return {
    price: await price.json(),
    trend: await trend.json(),
    regional: await regional.json(),
  }
}
