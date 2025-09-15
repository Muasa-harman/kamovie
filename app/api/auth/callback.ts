import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const request_token = searchParams.get("request_token");

  if (!request_token) {
    return NextResponse.json({ error: "Missing request_token" }, { status: 400 });
  }

  const res = await fetch("https://api.themoviedb.org/4/auth/access_token", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.TMDB_V4_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ request_token }),
  });

  const data = await res.json();

  if (!data.success) {
    return NextResponse.json(data, { status: 400 });
  }

  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?access_token=${data.access_token}`
  );
}
