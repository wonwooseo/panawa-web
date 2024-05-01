import { API_URL } from "$env/static/private"
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ url }) => {
  const regionCode = url.searchParams.get('region_code');
  return await fetch(`${API_URL}/price/region?region_code=${regionCode}`);
}
