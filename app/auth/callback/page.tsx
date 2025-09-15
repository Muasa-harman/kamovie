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
    const accessToken = searchParams.get("access_token");
    if (!accessToken) {
      console.error("Missing access_token in callback URL");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch("https://api.themoviedb.org/3/account", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!res.ok) {
          throw new Error(`TMDb API error: ${res.status}`);
        }

        const user = await res.json();

        dispatch(
          setAuth({
            accessToken,
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

        router.push("/"); // redirect to homepage
      } catch (error) {
        console.error("Failed to fetch TMDb user:", error);
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


