import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";

interface MovieCardProps {
  title: string;
  rating: number;
  poster: string;
  id:number;
}

const MovieCard: React.FC<MovieCardProps> = ({ title, rating, poster,id }) => {
    const router = useRouter();
  return (
    <Card onClick={()=>router.push(`/movies/${id}`)} className="relative min-w-[160px] h-[260px] overflow-hidden rounded-xl shadow-md hover:scale-105 transition-transform cursor-pointer">
      {/* Poster */}
      <div className="h-full w-full">
        <img
          src={poster}
          alt={title}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

      {/* Card Content */}
      <CardContent className="absolute bottom-0 left-0 right-0 p-3 text-white">
        <h3 className="text-sm font-semibold truncate">{title}</h3>
      </CardContent>

      {/* Footer */}
      <CardFooter className="absolute bottom-0 left-0 right-0 px-3 pb-3 text-yellow-400 flex items-center gap-1 text-xs">
        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
        {rating.toFixed(1)}/10
      </CardFooter>
    </Card>
  );
};

export default MovieCard;
