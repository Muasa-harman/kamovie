import { useWatchlist } from "@/hooks/useWatchlist";
import { Button } from "../ui/button";

export default function WatchlistCard({ movie }: { movie: any }) {
  const { isInWatchlist, toggleWatchlist } = useWatchlist(movie.id);

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden">
      <img
        src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
        alt={movie.title}
        className="w-full h-[400px] object-cover"
      />
      <div className="p-4 flex flex-col gap-2">
        <h2 className="text-lg font-semibold">{movie.title}</h2>
        <p className="text-sm text-gray-400">
          ⭐ {movie.vote_average} | {movie.release_date}
        </p>
        <Button
          onClick={() => toggleWatchlist(movie)}
          className={`mt-2 px-4 py-2 rounded-full font-semibold ${
            isInWatchlist ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {isInWatchlist ? "Remove" : "+ Add"}
        </Button>
      </div>
    </div>
  );
}