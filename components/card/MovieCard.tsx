

import React from "react";
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";

interface MovieCardProps {
  title: string;
  rating: number;
  poster: string;
  id: number;
}

export default function MovieCard({ title, rating, poster, id }: MovieCardProps) {
  const router = useRouter();

  return (
    <Card
      onClick={() => router.push(`/movies/${id}`)}
      className="relative w-full h-[300px] overflow-hidden rounded-xl shadow-md hover:scale-105 transition-transform cursor-pointer"
    >
      {/* Poster */}
      <img
        src={poster}
        alt={title}
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black via-black/60 to-transparent" />
      {/* Text Overlay */}
      <div className="absolute bottom-0 w-full p-3 text-white">
        <h3 className="text-sm font-semibold truncate">{title}</h3>
        <div className="flex items-center gap-1 text-yellow-400 text-xs">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          {rating.toFixed(1)}/10
        </div>
      </div>
    </Card>
  );
}

