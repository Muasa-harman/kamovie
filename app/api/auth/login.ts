import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch("https://api.themoviedb.org/4/auth/request_token", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      redirect_to: `${process.env.NEXT_PUBLIC_APP_URL}/app/auth/callback`,
    }),
  });

  const data = await res.json();

  if (!data.request_token) {
    return NextResponse.json({ error: "Failed to get request_token" }, { status: 400 });
  }

  // **Redirect browser directly to TMDb login**
  return NextResponse.redirect(
    `https://www.themoviedb.org/auth/access?request_token=${data.request_token}`
  );
}
