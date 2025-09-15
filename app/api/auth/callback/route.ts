import { exchangeAccessToken } from "@/lib/movieApi";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const requestToken = searchParams.get("request_token");

  if (!requestToken) {
    return NextResponse.json({ error: "Missing request_token" }, { status: 400 });
  }

  const data = await exchangeAccessToken(requestToken);

  if (!data.success) {
    return NextResponse.json(data, { status: 400 });
  }

  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_APP_URL}/auth/success?access_token=${data.access_token}`
  );
}

