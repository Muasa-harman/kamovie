"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { setAuth } from "@/store/slice/authSlice";
import Spinner from "@/components/Spinner";

export default function AuthCallback() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (!sessionId) {
      console.error("Missing session_id in callback URL");
      router.push("/auth/error");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/account?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY_V3}&session_id=${sessionId}`
        );

        if (!res.ok) {
          throw new Error(`TMDb API error: ${res.status}`);
        }

        const user = await res.json();

        dispatch(
          setAuth({
            sessionId,
            user: {
              id: user.id,
              username: user.username,
              name: user.name || user.username,
              avatar: user.avatar?.tmdb?.avatar_path
                ? `https://image.tmdb.org/t/p/w200${user.avatar.tmdb.avatar_path}`
                : undefined,
            },
          })
        );

        router.push("/");
      } catch (error) {
        console.error("Failed to fetch TMDb user:", error);
        router.push("/auth/error");
      }
    };

    fetchUser();
  }, [searchParams, dispatch, router]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/90 z-50">
      <Spinner />
    </div>
  );
}


