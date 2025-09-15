// "use client";

// import { useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { useRouter, useSearchParams } from "next/navigation";
// import { setAuth } from "@/store/slice/authSlice";

// export default function CallbackPage() {
//   const dispatch = useDispatch();
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   useEffect(() => {
//     const requestToken = searchParams.get("request_token");

//     if (!requestToken) {
//       router.push("/"); // fallback
//       return;
//     }

//     (async () => {
//       try {
//         // Exchange request_token for access_token
//         const tokenRes = await fetch(`/api/auth/access?request_token=${requestToken}`);
//         const tokenData = await tokenRes.json();

//         if (!tokenData.access_token) {
//           router.push("/"); // fallback
//           return;
//         }

//         const accessToken = tokenData.access_token;

//         // Fetch user account details from TMDb
//         const userRes = await fetch("https://api.themoviedb.org/3/account", {
//           headers: { Authorization: `Bearer ${accessToken}` },
//         });
//         const user = await userRes.json();

//         dispatch(
//           setAuth({
//             accessToken,
//             user: {
//               id: user.id.toString(), // ensure string type if your Redux type requires
//               username: user.username,
//               name: user.name || user.username,
//               avatar: user.avatar?.tmdb?.avatar_path
//                 ? `https://image.tmdb.org/t/p/w200${user.avatar.tmdb.avatar_path}`
//                 : undefined,
//             },
//           })
//         );

//         router.push("/"); // redirect to home or dashboard after login
//       } catch (err) {
//         console.error("[CallbackPage] Error logging in:", err);
//         router.push("/"); // fallback
//       }
//     })();
//   }, [dispatch, router, searchParams]);

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black/90 z-50">
//       <p className="text-white">Logging you in...</p>
//     </div>
//   );
// }

// "use client";

// import { useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useDispatch } from "react-redux";
// import { setAuth } from "@/store/slice/authSlice";
// import Spinner from "@/components/Spinner";

// export default function AuthCallback() {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const dispatch = useDispatch();

//   useEffect(() => {
//     const accessToken = searchParams.get("access_token");
//     if (!accessToken) {
//       console.error("Missing access_token in callback URL");
//       return;
//     }

//     // Fetch TMDb user info
//     const fetchUser = async () => {
//       try {
//         const res = await fetch("https://api.themoviedb.org/3/account", {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         });

//         if (!res.ok) {
//           throw new Error(`TMDb API error: ${res.status}`);
//         }

//         const user = await res.json();

//         dispatch(
//           setAuth({
//             accessToken,
//             user: {
//               id: user.id,
//               username: user.username,
//               name: user.name || user.username,
//               avatar: user.avatar?.tmdb?.avatar_path
//                 ? `https://image.tmdb.org/t/p/w200${user.avatar.tmdb.avatar_path}`
//                 : undefined,
//             },
//           })
//         );

//         router.push("/"); // redirect to homepage
//       } catch (error) {
//         console.error("Failed to fetch TMDb user:", error);
//       }
//     };

//     fetchUser();
//   }, [searchParams, dispatch, router]);

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black/90 z-50">
//       <Spinner />
//     </div>
//   );
// }



// "use client";

// import { useEffect } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
// import { useDispatch } from "react-redux";
// import { setAuth } from "@/store/slice/authSlice";
// import { AppDispatch } from "@/store/store";

// export default function CallbackPage() {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const dispatch = useDispatch<AppDispatch>();

//   useEffect(() => {
//     const request_token = searchParams.get("request_token");
//     if (!request_token) return;

//     const fetchAccessToken = async () => {
//       const res = await fetch("/api/auth/access-token", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ request_token }),
//       });
//       const data = await res.json();

//       if (data.success && data.access_token) {
//         const userRes = await fetch("https://api.themoviedb.org/4/account", {
//           headers: { Authorization: `Bearer ${data.access_token}` },
//         });
//         const userData = await userRes.json();

//         const user = {
//           id: userData.id,
//           username: userData.username,
//           name: userData.name,
//           avatar: userData.avatar?.tmdb?.avatar_path
//             ? `https://image.tmdb.org/t/p/w185${userData.avatar.tmdb.avatar_path}`
//             : undefined,
//         };
//         dispatch(setAuth({ accessToken: data.access_token, user }));

//         router.push("/"); 
//       }
//     };

//     fetchAccessToken();
//   }, [searchParams, dispatch, router]);

//   return <p>Signing you in...</p>;
// }
