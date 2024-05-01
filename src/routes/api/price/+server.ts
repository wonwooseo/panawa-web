import { API_URL } from "$env/static/private"
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async () => {
  return await fetch(`${API_URL}/price`);
}
