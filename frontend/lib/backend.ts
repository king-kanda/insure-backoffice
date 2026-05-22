// Server-side URL for proxying to FastAPI (never exposed to the browser)
export const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8000";

export const API_KEY = "ins_live_key_demo_2024";

export async function backendFetch(path: string, init?: RequestInit) {
  const url = `${BACKEND_URL}${path}`;
  return fetch(url, {
    ...init,
    headers: {
      "x-api-key": API_KEY,
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });
}
