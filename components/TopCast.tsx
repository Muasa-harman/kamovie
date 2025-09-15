"use client";

import React from "react";
import { Cast, TopCastProps } from "@/lib/types";



export default function TopCast({ cast }: TopCastProps) {
  if (!cast || cast.length === 0) return null;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-2">Top Cast</h2>
      <div className="flex gap-4 overflow-x-auto py-3">
        {cast.slice(0, 8).map((c) => (
          <div key={c.id} className="text-center">
            {c.profile_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w200${c.profile_path}`}
                alt={c.name}
                className="w-20 h-28 object-cover rounded-lg mb-1"
              />
            ) : (
              <div className="w-20 h-28 bg-gray-700 rounded-lg mb-1 flex items-center justify-center text-xs">
                No Image
              </div>
            )}
            <p className="text-sm">{c.name}</p>
            <p className="text-xs text-gray-400">{c.character}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
