import { NextRequest, NextResponse } from "next/server";
import { validateApiKey } from "@/lib/auth";
import { backendFetch } from "@/lib/backend";

export async function GET(request: NextRequest) {
  const authError = validateApiKey(request);
  if (authError) return authError;
  const { searchParams } = new URL(request.url);
  const claim_id = searchParams.get("claim_id");
  if (!claim_id) return NextResponse.json({ error: "claim_id is required" }, { status: 400 });
  const res = await backendFetch(`/api/claims/status?claim_id=${encodeURIComponent(claim_id)}`);
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
