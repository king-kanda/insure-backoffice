import { NextRequest, NextResponse } from "next/server";
import { validateApiKey } from "@/lib/auth";
import { backendFetch, BACKEND_URL, API_KEY } from "@/lib/backend";

export async function GET(request: NextRequest, { params }: { params: Promise<{ claim_id: string }> }) {
  const authError = validateApiKey(request);
  if (authError) return authError;
  const { claim_id } = await params;
  const res = await backendFetch(`/api/claims/${encodeURIComponent(claim_id)}`);
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ claim_id: string }> }) {
  const authError = validateApiKey(request);
  if (authError) return authError;
  const { claim_id } = await params;
  const body = await request.json();
  const res = await fetch(`${BACKEND_URL}/api/claims/${encodeURIComponent(claim_id)}/status`, {
    method: "PATCH",
    headers: { "x-api-key": API_KEY, "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
