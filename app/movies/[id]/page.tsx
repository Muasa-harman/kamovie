"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getMovieDetails } from "@/lib/movieApi";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/Spinner";

interface MovieDetailsType {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
  genres: { id: number; name: string }[];
  credits?: {
    cast: {
      id: number;
      name: string;
      character: string;
      profile_path: string;
    }[];
    crew: { id: number; name: string; job: string }[];
  };
  videos?: {
    results: {
      id: string;
      type: string;
      site: string;
      key: string;
      name: string;
    }[];
  };
}

export default function MovieDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [movie, setMovie] = useState<MovieDetailsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    getMovieDetails(Number(id))
      .then((data) => setMovie(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black/90">
        <Spinner />
      </div>
    );
  }

  if (!movie) {
    return <div className="text-white text-center mt-10">Movie not found</div>;
  }

  const directors =
    movie.credits?.crew.filter((c) => c.job === "Director") || [];
  const writers =
    movie.credits?.crew.filter((c) =>
      ["Writer", "Screenplay", "Story"].includes(c.job)
    ) || [];

  const trailer = movie.videos?.results.find(
    (v) => v.type === "Trailer" && v.site === "YouTube"
  );

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10 bg-black/90 text-white">
      <Button
        onClick={() => router.back()}
        className="mb-6 px-4 py-2 rounded-full bg-primary hover:bg-primary-hover transition cursor-pointer" 
      >
        Back
      </Button>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Poster */}
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="w-full md:w-1/3 rounded-xl object-cover"
        />

        {/* Movie Info */}
        <div className="flex-1">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">{movie.title}</h1>
          <p className="text-gray-300 mb-2">
            <strong>Release Date:</strong> {movie.release_date}
          </p>
          <p className="text-gray-300 mb-2">
            <strong>Rating:</strong> {movie.vote_average}/10
          </p>
          <p className="text-gray-300 mb-2">
            <strong>Genres:</strong>{" "}
            {movie.genres.map((g) => g.name).join(", ")}
          </p>

          {directors.length > 0 && (
            <p className="text-gray-300 mb-1">
              <strong>Director:</strong>{" "}
              {directors.map((d) => d.name).join(", ")}
            </p>
          )}
          {writers.length > 0 && (
            <p className="text-gray-300 mb-4">
              <strong>Writer:</strong> {writers.map((w) => w.name).join(", ")}
            </p>
          )}

          <p className="text-gray-200 mb-6">{movie.overview}</p>

          {/* Trailer Button */}
          {trailer && (
            <Button
              onClick={() => setIsTrailerOpen(true)}
              className="mb-6 rounded-full bg-primary/100 hover:bg-primary/90 font-semibold px-6 py-3 cursor-pointer"
            >
              ▶ Watch Trailer
            </Button>
          )}

          {/* Top Cast */}
          {movie.credits && movie.credits.cast.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-2">Top Cast</h2>
              <div className="flex gap-4 overflow-x-auto py-3">
                {movie.credits.cast.slice(0, 8).map((c) => (
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
          )}
        </div>
      </div>

      {/* Trailer Modal */}
      {isTrailerOpen && trailer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/80">
          <div className="relative w-full max-w-4xl aspect-video">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
              title="Movie Trailer"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
            <button
              onClick={() => setIsTrailerOpen(false)}
              className="absolute top-2 right-2 text-white text-2xl font-bold hover:text-red-500 cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
