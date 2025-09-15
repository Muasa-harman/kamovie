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
      router.push("/"); 
      return;
    }

    (async () => {
      try {
        const user = await getUserInfo(accessToken);
        dispatch(setAuth({ accessToken, user }));
        router.push("/");
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

