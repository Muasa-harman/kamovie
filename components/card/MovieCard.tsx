

import React from "react";
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { MovieCardProps } from "@/lib/types";


export default function MovieCard({ title, rating, poster, id, type="movie" }: MovieCardProps) {
  const router = useRouter();

  const handleClick = () => {
    if (type === "tv") {
      router.push(`/tv/${id}`);
    } else {
      router.push(`/movies/${id}`);
    }
  };

  return (
    <Card
      onClick={handleClick}
      className="relative w-full h-[300px] overflow-hidden rounded-xl shadow-md hover:scale-105 transition-transform cursor-pointer"
    >
      <img
        src={poster}
        alt={title}
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black via-black/60 to-transparent" />
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

