import { API_URL } from "$env/static/private"
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ url }) => {
  const window = url.searchParams.get('window');
  return await fetch(`${API_URL}/price/trend?window=${window}`);
}
