"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserInfo } from "@/lib/movieApi";
import { useDispatch } from "react-redux";
import { setAuth } from "@/store/slice/authSlice";
import Spinner from "@/components/Spinner";

export default function SuccessPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("access_token");

    if (!accessToken) {
      router.push("/"); // No token? Go home
      return;
    }

    (async () => {
      try {
        const user = await getUserInfo(accessToken);
        dispatch(setAuth({ accessToken, user }));
        router.push("/"); // Redirect to home after login
      } catch (err) {
        console.error(err);
        router.push("/"); 
      } finally {
        setLoading(false);
      }
    })();
  }, [dispatch, router]);

  return <div>{loading ? <Spinner/> : "Redirecting..."}</div>;
}




// "use client";

// import { useEffect, useState } from "react";
// import { useDispatch } from "react-redux";
// import { useRouter, useSearchParams } from "next/navigation";
// import { setAuth } from "@/store/slice/authSlice";
// import Spinner from "@/components/Spinner";
// import { getUserInfo } from "@/lib/movieApi";
// // import { getUserInfo } from "@/lib/tmdbClient";

// export default function AuthSuccess() {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const dispatch = useDispatch();
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const accessToken = searchParams.get("access_token");

//     if (!accessToken) {
//       setError("No access token found.");
//       return;
//     }

//     (async () => {
//       try {
//         const user = await getUserInfo(accessToken);

//         // Save access token and user info in Redux
//         dispatch(setAuth({ accessToken, user }));

//         router.push("/"); // redirect to home after login
//       } catch (err) {
//         console.error(err);
//         setError("Failed to fetch user info.");
//       }
//     })();
//   }, [dispatch, router, searchParams]);

//   if (error) return <p className="p-6 text-red-500">{error}</p>;

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black/90 z-50">
//       <Spinner />
//     </div>
//   );
// }
