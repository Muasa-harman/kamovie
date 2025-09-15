"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getMovieDetails } from "@/lib/movieApi";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/Spinner";
import { useWatchlist } from "@/hooks/useWatchlist";
import Toast from "@/components/Toast";
import { Cast, Crew, Genre, TVDetailsType, Video } from "@/lib/types";
import TopCast from "@/components/TopCast";



export default function TVDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [tv, setTV] = useState<TVDetailsType | null>(null);
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
    tv
      ? {
          id: tv.id,
          title: tv.name,
          type:"tv",
          poster_path:tv.poster_path,
          vote_average:tv.vote_average,
          release_date:tv.first_air_date,
        }
      : undefined
  );
  useEffect(() => {
    if (!id) return;
    setLoading(true);

    getMovieDetails("tv", Number(id))
      .then((data) => setTV(data))
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

  if (!tv) {
    return (
      <div className="text-white text-center mt-10">TV Show not found</div>
    );
  }

  const creators = tv.created_by || [];
  const writers =
    tv.credits?.crew.filter((c: Crew) =>
      ["Writer", "Screenplay", "Story"].includes(c.job)
    ) || [];
  const trailer = tv.videos?.results.find(
    (v: Video) => v.type === "Trailer" && v.site === "YouTube"
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
        <img
          src={`https://image.tmdb.org/t/p/w500${tv.poster_path}`}
          alt={tv.name}
          className="w-full md:w-1/3 rounded-xl object-cover"
        />
        <div className="flex-1">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">{tv.name}</h1>

          <p className="text-gray-300 mb-2">
            <strong>First Air Date:</strong> {tv.first_air_date}
          </p>
          <p className="text-gray-300 mb-2">
            <strong>Rating:</strong> {tv.vote_average}/10
          </p>
          <p className="text-gray-300 mb-2">
            <strong>Genres:</strong>{" "}
            {tv.genres.map((g: Genre) => g.name).join(", ")}
          </p>

          {creators.length > 0 && (
            <p className="text-gray-300 mb-1">
              <strong>Creators:</strong>{" "}
              {creators.map((c) => c.name).join(", ")}
            </p>
          )}
          {writers.length > 0 && (
            <p className="text-gray-300 mb-4">
              <strong>Writer(s):</strong>{" "}
              {writers.map((w: Crew) => w.name).join(", ")}
            </p>
          )}

          <p className="text-gray-200 mb-6">{tv.overview}</p>
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
          {tv.credits && tv.credits.cast.length > 0 && (
            <TopCast cast={tv.credits.cast}/>
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
              title="TV Show Trailer"
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
