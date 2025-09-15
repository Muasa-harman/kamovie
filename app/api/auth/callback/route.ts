import { exchangeAccessToken } from "@/lib/movieApi";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const requestToken = searchParams.get("request_token");

  if (!requestToken) {
    return NextResponse.json({ error: "Missing request_token" }, { status: 400 });
  }

  // Exchange request_token for a user access_token
  const data = await exchangeAccessToken(requestToken);

  if (!data.success) {
    return NextResponse.json(data, { status: 400 });
  }

  // Redirect to frontend success page with the access_token
  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_APP_URL}/auth/success?access_token=${data.access_token}`
  );
}



// import { NextResponse } from "next/server";

// export async function GET(req: Request) {
//   const { searchParams } = new URL(req.url);
//   const request_token = searchParams.get("request_token");

//   if (!request_token) {
//     return NextResponse.json({ error: "Missing request_token" }, { status: 400 });
//   }

//   const res = await fetch("https://api.themoviedb.org/4/auth/access_token", {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ request_token }),
//   });

//   const data = await res.json();

//   if (!data.success) {
//     return NextResponse.json(data, { status: 400 });
//   }

//   return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/auth/success?access_token=${data.access_token}`);
// }


