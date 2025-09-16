"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setAuth } from "@/store/slice/authSlice";
import { User } from "@/lib/types";
import { RootState } from "@/store/store";

export default function AuthSuccess() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const authState = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    

    if (!sessionId) {
      console.log("No session_id found, redirecting home.");
      router.push("/");
      return;
    }

    (async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/account?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY_V3}&session_id=${sessionId}`
        );
        console.log("response data", res)

        if (!res.ok) throw new Error(`TMDB API error: ${res.status}`);

        const data = await res.json();

        const user: User = {
          id: data.id,
          username: data.username,
          name: data.name || data.username,
          avatar: data.avatar?.tmdb?.avatar_path
            ? `https://image.tmdb.org/t/p/w200${data.avatar.tmdb.avatar_path}`
            : null,
        };

        console.log("Fetched TMDB user:", user);

        dispatch(setAuth({ sessionId: sessionId || undefined, user }));

        console.log("Dispatched auth state with sessionId:", sessionId);
        setTimeout(() => {
  router.push("/");
}, 2000);
      } catch (err) {
        console.error("Failed to fetch TMDB user:", err);
        router.push("/");
      } finally {
        setLoading(false);
      }
    })();
  }, [dispatch, router, searchParams]);

  useEffect(() => {
    console.log("Redux auth state updated:", authState);
  }, [authState]);

  return (
    <div className="flex justify-center items-center h-screen text-lg">
      {loading
        ? "Please wait while we fetch your account details..."
        : "Redirecting..."}
    </div>
  );
}

