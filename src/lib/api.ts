const apiUrl = import.meta.env.VITE_API_URL as string;

export async function fetchPriceData(): Promise<any> {
  const response = await fetch(`${apiUrl}/price`);
  const data = await response.json();
  return data;
}

export async function fetchPriceTrendData(): Promise<any> {
  const response = await fetch(`${apiUrl}/price/trend`);
  const data = await response.json();
  return data;
}

export async function fetchRegionalMarketPriceData(regionCode: string): Promise<any> {
  const response = await fetch(`${apiUrl}/price/region?region_code=${regionCode}`);
  const data = await response.json();
  return data;
}
