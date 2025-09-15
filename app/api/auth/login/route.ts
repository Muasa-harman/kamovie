import { NextResponse } from "next/server";
import { createRequestToken } from "@/lib/movieApi";

export async function GET() {
  const data = await createRequestToken(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`);

  if (!data.request_token) {
    return NextResponse.json({ error: "Failed to get request_token" }, { status: 400 });
  }

  return NextResponse.redirect(
    `https://www.themoviedb.org/auth/access?request_token=${data.request_token}`
  );
}
