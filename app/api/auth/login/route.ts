import { NextResponse } from "next/server";
import { createRequestToken } from "@/lib/movieApi";

export async function GET() {
  const data = await createRequestToken(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`);

  if ( !data.success || !data.request_token) {
     console.error("Failed to create request token:", data);
    return NextResponse.json({ error: "Failed to get request_token", details:data }, { status: 400 });
  }
   return NextResponse.redirect(data.redirectUrl);
}
