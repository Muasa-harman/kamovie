// import { exchangeAccessToken } from "@/lib/movieApi";
// import { NextResponse } from "next/server";

// export async function GET(req: Request) {
//   const { searchParams } = new URL(req.url);
//   const requestToken = searchParams.get("request_token"); // from TMDb redirect

//   if (!requestToken) {
//     return NextResponse.json({ error: "Missing request_token" }, { status: 400 });
//   }

//   const data = await exchangeAccessToken(requestToken);

//   if (!data.success) {
//     return NextResponse.json(data, { status: 400 });
//   }

//   // Redirect to frontend success page with access_token
//   return NextResponse.redirect(
//     `${process.env.NEXT_PUBLIC_APP_URL}/auth/success?access_token=${data.access_token}`
//   );
// }
import { NextResponse } from "next/server";
import { createRequestToken } from "@/lib/movieApi";

export async function GET() {
  // Create a request token for TMDb login
  const data = await createRequestToken(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`);

  if (!data.request_token) {
    return NextResponse.json({ error: "Failed to get request_token" }, { status: 400 });
  }

  // Redirect the user to TMDb login page
  return NextResponse.redirect(
    `https://www.themoviedb.org/auth/access?request_token=${data.request_token}`
  );
}



// // app/api/auth/callback
// import { createRequestToken } from "@/lib/movieApi";
// import { NextResponse } from "next/server";
// // import { createRequestToken } from "@/lib/tmdbClient";

// export async function GET() {
//   // Create request token with redirect to your callback page
//   const data = await createRequestToken(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`);

//   if (!data.request_token) {
//     return NextResponse.json({ error: "Failed to get request_token" }, { status: 400 });
//   }

//   // Store request_token in a cookie for later retrieval in callback
//   const response = NextResponse.redirect(
//     `https://www.themoviedb.org/auth/access?request_token=${data.request_token}`
//   );
//   response.cookies.set("tmdb_request_token", data.request_token, { path: "/", httpOnly: true });

//   return response;
// }



// // api/auth/login.ts
// import { NextResponse } from "next/server";

// export async function GET() {
//   const res = await fetch("https://api.themoviedb.org/4/auth/request_token", {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       redirect_to: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
//     }),
//   });

//   const data = await res.json();

//   if (!data.request_token) {
//     return NextResponse.json(
//       { error: "Failed to get request_token from TMDB" },
//       { status: 400 }
//     );
//   }

//   // **Redirect browser directly to TMDb login**
//   return NextResponse.redirect(
//   `https://www.themoviedb.org/auth/access?request_token=${data.request_token}`
// );

//   // return NextResponse.json({
//   // redirect: `https://www.themoviedb.org/auth/access?request_token=${data.request_token}`,
// // });

// }



// // api/auth/long
// import { NextResponse } from "next/server";

// export async function GET() {
//   const res = await fetch("https://api.themoviedb.org/4/auth/request_token", {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       redirect_to: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
//     }),
//   });

//   const data = await res.json();

//   if (!data.request_token) {
//     return NextResponse.json(
//       { error: "Failed to get request_token from TMDB" },
//       { status: 400 }
//     );
//   }

//   return NextResponse.json({
//     redirect: `https://www.themoviedb.org/auth/access?request_token=${data.request_token}`,
//   });
// }



// import { createRequestToken } from "@/lib/movieApi";
// import { NextResponse } from "next/server";

// export async function GET() {
//   try {
//     const redirectTo = `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`;

//     const data = await createRequestToken(redirectTo);

//     if (!data.success) {
//       return NextResponse.json({ error: "Failed to create request token", data }, { status: 400 });
//     }

//     return NextResponse.redirect(
//       `https://www.themoviedb.org/auth/access?request_token=${data.request_token}`
//     );
//   } catch (err) {
//     console.error("[Auth/Login] Error:", err);
//     return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
//   }
// }
