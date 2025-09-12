"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useWatchlist } from "@/hooks/useWatchlist";

export default function WatchlistPage() {
  const router = useRouter();

 
  const { movies, removeFromWatchlist } = useWatchlist();

  const watchlistMovies = Object.values(movies);

  if (watchlistMovies.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
        <h1 className="text-3xl font-bold mb-4">Your Watchlist is empty</h1>
        <Button
          onClick={() => router.push("/")}
          className="px-6 py-3 rounded-full"
        >
          Browse Movies
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10 bg-black text-white">
      <h1 className="text-4xl font-bold mb-6">My Watchlist</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {watchlistMovies.map((movie) => (
          <div
            key={movie.id}
            className="bg-gray-900 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition"
          >
            <img
              src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
              alt={movie.title}
              className="w-full h-[400px] object-cover"
            />
            <div className="p-4 flex flex-col gap-2">
              <h2 className="text-lg font-semibold line-clamp-1">
                {movie.title}
              </h2>
              <p className="text-sm text-gray-400">
                ⭐ {movie.vote_average} | {movie.release_date}
              </p>
              <Button
                onClick={() => removeFromWatchlist(movie.id)}
                className="mt-2 px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold"
              >
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
