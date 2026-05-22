import { NextRequest, NextResponse } from "next/server";
import { validateApiKey } from "@/lib/auth";
import { BACKEND_URL, API_KEY } from "@/lib/backend";

export async function POST(request: NextRequest) {
  const authError = validateApiKey(request);
  if (authError) return authError;
  const body = await request.formData();
  const res = await fetch(`${BACKEND_URL}/api/covers/create`, {
    method: "POST",
    headers: { "x-api-key": API_KEY },
    body,
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
