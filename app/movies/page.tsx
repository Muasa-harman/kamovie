"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { discoverMovies, searchMovies } from "@/lib/movieApi";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/Spinner";
import MovieCard from "@/components/card/MovieCard";

export default function MoviesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const page = Number(searchParams.get("page") || 1);

  useEffect(() => {
    async function loadMovies() {
      setLoading(true);

      const query = searchParams.get("query") || "";
      const filters = {
        query,
        genre: searchParams.get("genre") || "",
        year: searchParams.get("year") || "",
        rating: searchParams.get("rating") || "",
        duration: searchParams.get("duration") || "",
        sortBy: searchParams.get("sortBy") || "popularity.desc",
      };

      try {
        let data;
        if (query && !filters.genre && !filters.year && !filters.rating) {
          data = await searchMovies(query, page);
        } else {
          data = await discoverMovies({ ...filters, page });
        }
        setMovies(data.results);
        setTotalPages(data.totalPages);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadMovies();
  }, [searchParams, page]);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    router.push(`/movies?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black/90 text-white">
        <Spinner />
      </div>
    );
  }

  if (movies.length === 0) {
    return <div className="text-center py-20">No movies found</div>;
  }


  
  const query = searchParams.get("query") || "";
  const genre = searchParams.get("genre") || "";
  const year = searchParams.get("year") || "";

  let title = "Search Results";
  if (query) {
    title = `Results for "${query}"`;
  } else if (genre && year) {
    title = `${genre} Movies from ${year}`;
  } else if (genre) {
    title = `${genre} Movies`;
  } else if (year) {
    title = `Movies from ${year}`;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10 bg-black/90 text-white">
      <Button
        onClick={() => router.back()}
        className="mb-6 px-4 py-2 rounded-full bg-primary hover:bg-primary-hover transition"
      >
        Back
      </Button>
      <h1 className="text-3xl font-bold mb-6">{title}</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
  {movies.map((movie) => (
    <MovieCard
      key={movie.id}
      id={movie.id}
      title={movie.title}
      rating={movie.vote_average}
      poster={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
    />
  ))}
</div>


      <div className="flex justify-center gap-4 mt-8">
        <Button
          disabled={page === 1}
          onClick={() => handlePageChange(page - 1)}
        >
          Previous
        </Button>
        <span className="px-4 py-2 bg-gray-800 rounded">
          Page {page} of {totalPages}
        </span>
        <Button
          disabled={page === totalPages}
          onClick={() => handlePageChange(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

