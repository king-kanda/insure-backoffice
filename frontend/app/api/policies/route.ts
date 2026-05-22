import { NextRequest, NextResponse } from "next/server";
import { validateApiKey } from "@/lib/auth";
import { backendFetch } from "@/lib/backend";

export async function GET(request: NextRequest) {
  const authError = validateApiKey(request);
  if (authError) return authError;
  const res = await backendFetch("/api/policies");
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
