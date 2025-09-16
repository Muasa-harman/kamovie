import { NextResponse } from "next/server";

export async function GET(req: Request) {
  console.log("Full URL:", req.url);
  const { searchParams } = new URL(req.url);
  const request_token = searchParams.get("request_token");
  const approved = searchParams.get("approved");

  if (!request_token || approved !== "true") {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/auth/error`);
  }

  const res = await fetch(
    `https://api.themoviedb.org/3/authentication/session/new?api_key=${process.env.TMDB_API_KEY_V3}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ request_token }),
    }
  );

  const sessionData = await res.json();
  console.log("TMDB sessionData:", sessionData);

  if (!sessionData.success) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/auth/error`);
  }

  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_APP_URL}/auth/success?session_id=${sessionData.session_id}`
  );
}

