"use client";

import { useDispatch, useSelector } from "react-redux";
import { clearAuth } from "@/store/slice/authSlice";
import { AppDispatch, RootState } from "@/store/store";

export default function LogoutButton() {
  const dispatch = useDispatch<AppDispatch>();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  const handleLogout = async () => {
    if (!accessToken) return;

    await fetch("/api/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ access_token: accessToken }),
    });

    dispatch(clearAuth());
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-300"
    >
      Logout
    </button>
  );
}
