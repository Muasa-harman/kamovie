"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useWatchlist } from "@/hooks/useWatchlist";

const Navbar = () => {
  const { movies } = useWatchlist();
  const watchlistIds = Object.keys(movies);
  const [prevCount, setPrevCount] = useState(watchlistIds.length);

  useEffect(() => {
    setPrevCount(watchlistIds.length);
  }, [watchlistIds.length]);

  return (
    <nav className="bg-white text-white-foreground shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="text-xl font-bold text-primary hover:text-primary-hover transition-colors duration-300 cursor-pointer">
          <span className="text-black-700">K</span>amovy
        </div>
        <div className="justify-between">
          <Button className="px-4 py-2 bg-primary hover:bg-primary-hover text-primary-foreground rounded-lg transition-colors duration-300">
            Sign In
          </Button>
          <Link
            href="/watchlist"
            className="relative px-4 py-2 rounded-full bg-green-600 hover:bg-green-700 transition font-semibold"
          >
            Watchlist
            <AnimatePresence>
              {watchlistIds.length > 0 && (
                <motion.span
                  key={watchlistIds.length}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 20 }}
                  className="absolute -top-2 -right-2 bg-red-600 w-5 h-5 text-xs flex items-center justify-center rounded-full"
                >
                  {watchlistIds.length}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
