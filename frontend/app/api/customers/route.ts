import { NextRequest, NextResponse } from "next/server";
import { validateApiKey } from "@/lib/auth";
import { backendFetch, BACKEND_URL, API_KEY } from "@/lib/backend";

export async function GET(request: NextRequest) {
  const authError = validateApiKey(request);
  if (authError) return authError;
  const res = await backendFetch("/api/customers");
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function POST(request: NextRequest) {
  const authError = validateApiKey(request);
  if (authError) return authError;
  const body = await request.json();
  const res = await fetch(`${BACKEND_URL}/api/customers`, {
    method: "POST",
    headers: { "x-api-key": API_KEY, "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
