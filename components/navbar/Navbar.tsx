"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useWatchlist } from "@/hooks/useWatchlist";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { clearAuth } from "@/store/slice/authSlice";
import { Bookmark } from "lucide-react";
// import { clearAuth } from "@/store/authSlice";

const Navbar = () => {
  const { movies } = useWatchlist();
  const watchlistIds = Object.keys(movies);
  const [prevCount, setPrevCount] = useState(watchlistIds.length);

  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  console.log("User object:", user);

  const handleSignIn = async () => {
    const res = await fetch("/api/auth/login");
    const data = await res.json();

    if (data.redirect) {
      window.location.href = data.redirect;
    }
  };

  const handleLogout = () => {
    dispatch(clearAuth());
  };

  useEffect(() => {
    setPrevCount(watchlistIds.length);
  }, [watchlistIds.length]);

  return (
    <nav className="sticky top-0 z-50 bg-white/95 text-white-foreground backdrop-blur-md shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href={"/"}>
          <div className="text-xl font-bold text-primary hover:text-primary-hover transition-colors duration-300 cursor-pointer">
            <span className="text-black-700">K</span>amovy
          </div>
        </Link>

        <div className="flex items-center gap-4">
          {/* Watchlist */}
          
 {user && (
          <Link
            href="/watchlist"
            className="relative flex flex-col items-center justify-center group"
          >
            <div className="relative flex items-center justify-center p-2 rounded-full bg-primary-green hover:bg-green-700 transition">
              <Bookmark className="w-4 h-4 text-white" />
              {watchlistIds.length > 0 && (
                <motion.span
                  key={watchlistIds.length}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 20 }}
                  className="absolute -top-1 -right-1 bg-red-600 w-5 h-5 text-xs flex items-center justify-center rounded-full text-white"
                >
                  {watchlistIds.length}
                </motion.span>
              )}
            </div>

            {/* Label under icon */}
            <span className="mt-1 text-xs font-medium text-gray-700 group-hover:text-green-700">
              Watchlist
            </span>
          </Link>
          )}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer bg-green-600 text-white border border-gray-300 hover:opacity-90">
                  <AvatarImage src={user.avatar || ""} alt={user.username} />
                  <AvatarFallback className="text-primary">
                    {user.username[0]}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 z-[9999] bg-white text-black shadow-md border rounded-md"
              >
                <DropdownMenuLabel className="font-semibold">
                  My Account
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => alert(`User: ${user.username}`)}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  User Info
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              onClick={() => {
                window.location.href = "/api/auth/login";
              }}
              // onClick={() => (window.location.href = "/api/auth/login")}
              // onClick={handleSignIn}
              className="px-4 py-2 bg-primary hover:bg-primary-hover text-primary-foreground rounded-lg transition-colors duration-300"
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
