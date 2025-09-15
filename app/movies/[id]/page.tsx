"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getMovieDetails } from "@/lib/movieApi";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/Spinner";
import { useWatchlist } from "@/hooks/useWatchlist";
import Toast from "@/components/Toast";
import { Crew, Genre, MovieDetailsType, Video } from "@/lib/types";
import TopCast from "@/components/TopCast";


export default function MovieDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [movie, setMovie] = useState<MovieDetailsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  const {
    isInWatchlist,
    toggleWatchlist,
    toastMessage,
    showToast,
    toastType,
    handleUndo,
  } = useWatchlist(
    movie
      ? {
          id: movie.id,
          title: movie.title,
          type: "movie",
        }
      : undefined
  );

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    getMovieDetails("movie", Number(id))
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
    movie.credits?.crew.filter((c: Crew) => c.job === "Director") || [];
  const writers =
    movie.credits?.crew.filter((c: Crew) =>
      ["Writer", "Screenplay", "Story"].includes(c.job)
    ) || [];

  const trailer = movie.videos?.results.find(
    (v: Video) => v.type === "Trailer" && v.site === "YouTube"
  );

  return (
    <div className="min-h-screen w-full bg-black/90 text-white p-4 md:p-10 md:max-w-6xl md:mx-auto">
      <Button
        onClick={() => router.back()}
        className="mb-6 px-4 py-2 rounded-full bg-primary hover:bg-primary-hover transition cursor-pointer"
      >
        Back
      </Button>

      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="w-full md:w-1/3 rounded-xl object-cover"
        />
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
            {movie.genres.map((g: Genre) => g.name).join(", ")}
          </p>

          {directors.length > 0 && (
            <p className="text-gray-300 mb-1">
              <strong>Director:</strong>{" "}
              {directors.map((d: Crew) => d.name).join(", ")}
            </p>
          )}
          {writers.length > 0 && (
            <p className="text-gray-300 mb-4">
              <strong>Writer:</strong>{" "}
              {writers.map((w: Crew) => w.name).join(", ")}
            </p>
          )}

          <p className="text-gray-200 mb-6">{movie.overview}</p>
          <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
            {trailer && (
              <Button
                onClick={() => setIsTrailerOpen(true)}
                className="mb-6 rounded-full bg-primary/100 hover:bg-primary/90 font-semibold px-6 py-3 cursor-pointer"
              >
                ▶ Watch Trailer
              </Button>
            )}
            <Button
              onClick={toggleWatchlist}
              className={`rounded-full px-6 py-3 font-semibold ${
                isInWatchlist
                  ? "bg-primary/100 hover:bg-primary/90"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {isInWatchlist ? "✔ In Watchlist" : "+ Add to Watchlist"}
            </Button>
          </div>
          {movie.credits && movie.credits.cast.length > 0 && (
            <TopCast cast={movie.credits.cast}/>
          )}
        </div>
      </div>
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
              className="absolute top-2 right-2 text-white text-2xl font-bold hover:text-primary/50 cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}
      {showToast && (
        <Toast
          message={toastMessage}
          show={showToast}
          type={toastType}
          onUndo={toastType === "remove" ? handleUndo : undefined}
        />
      )}
    </div>
  );
}
