import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch("https://api.themoviedb.org/4/auth/request_token", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.TMDB_V4_ACCESS_TOKEN}`, // from env
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      redirect_to: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    }),
  });

  const data = await res.json();
  return NextResponse.json(data);
}
