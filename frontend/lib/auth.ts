import { NextRequest, NextResponse } from "next/server";

export const DEFAULT_API_KEY = "ins_live_key_demo_2024";

export function validateApiKey(request: NextRequest): NextResponse | null {
  const key = request.headers.get("x-api-key");
  if (!key || key !== DEFAULT_API_KEY) {
    return NextResponse.json({ error: "Invalid or missing API key" }, { status: 401 });
  }
  return null;
}
