import { revokeAccessToken } from "@/lib/movieApi";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { access_token } = await req.json();

    if (!access_token) {
      return NextResponse.json({ error: "Missing access_token" }, { status: 400 });
    }

    const data = await revokeAccessToken(access_token);
    return NextResponse.json(data);
  } catch (err) {
    console.error("[Auth/Logout] Error:", err);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
