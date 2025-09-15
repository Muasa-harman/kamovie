import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { request_token } = await req.json();

  const res = await fetch("https://api.themoviedb.org/4/auth/access_token", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.TMDB_V4_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ request_token }),
  });

  const data = await res.json();
  return NextResponse.json(data);
}
