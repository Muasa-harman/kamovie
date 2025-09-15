import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { access_token } = await req.json();

  const res = await fetch("https://api.themoviedb.org/4/auth/access_token/delete", {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${process.env.TMDB_V4_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ access_token }),
  });

  const data = await res.json();
  return NextResponse.json(data);
}
