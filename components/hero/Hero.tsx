"use client";

import React, { useEffect, useState, useRef } from "react";
import { Search, Filter, ChevronDown } from "lucide-react";
import {
  getTrendingMovies,
  getRecommendedTVShows,   
  getRecommendedMovies,    
  getUpcomingMovies,
  discoverMovies,
  getGenres,
  getKeywords,
} from "@/lib/movieApi";
import HeroHeadline from "./Hero.ts/HeroHeadline";
import { useRouter } from "next/navigation";
import { Filters, Genre, Keyword, Movie, Stats } from "@/lib/types";


export default function Hero() {
  const router = useRouter();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [filters, setFilters] = useState<Filters>({
    genre: "",
    year: "",
    rating: "",
    duration: "",
    sortBy: "popularity.desc",
  });
  const [stats, setStats] = useState<Stats>({
    trending: 0,
    popular: 0,
    topRated: 0,
    upcoming: 0,
  });
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [trendingGenres, setTrendingGenres] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<Keyword[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  const [pendingQuery, setPendingQuery] = useState<string | null>(null);

  const filtersRef = useRef<HTMLDivElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pendingQuery !== null) {
      router.push(pendingQuery);
      setPendingQuery(null);
    }
  }, [pendingQuery, router]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        filtersRef.current &&
        !filtersRef.current.contains(event.target as Node)
      ) {
        setShowFilters(false);
      }
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    async function loadData() {
      try {
        const [trending, recommendedTV, recommendedMovies, upcoming, genreList] =
          await Promise.all([
            getTrendingMovies() as Promise<Movie[]>,
            getRecommendedTVShows() as Promise<Movie[]>,
            getRecommendedMovies() as Promise<Movie[]>,
            getUpcomingMovies() as Promise<Movie[]>,
            getGenres() as Promise<Genre[]>,
          ]);

        setMovies(trending.slice(0, 12));
        setGenres(genreList);

        setStats({
          trending: trending.length,
          popular: recommendedTV.length,
          topRated: recommendedMovies.length,
          upcoming: upcoming.length,
        });

        const years = Array.from(
          new Set<number>(
            trending
              .map((m) => m.release_date?.split("-")[0])
              .filter(Boolean)
              .map(Number)
          )
        ).sort((a, b) => b - a);
        setAvailableYears(years);

        // Top trending genres
        const genreCounts: Record<string, number> = {};
        trending.forEach((m) => {
          m.genre_ids.forEach((gid) => {
            const g = genreList.find((gn) => gn.id === gid);
            if (g) genreCounts[g.name] = (genreCounts[g.name] || 0) + 1;
          });
        });
        const topGenres = Object.entries(genreCounts)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(([g]) => g);
        setTrendingGenres(topGenres);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      getKeywords(searchQuery)
        .then((data: Keyword[]) => {
          setSuggestions(data.slice(0, 6));
          setShowSuggestions(true);
        })
        .catch(console.error);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  const handleSearch = async (customFilters?: Filters) => {
    const activeFilters = customFilters ?? filters;

    const queryParams = new URLSearchParams();
    if (searchQuery) queryParams.set("query", searchQuery);
    if (activeFilters.genre) queryParams.set("genre", activeFilters.genre);
    if (activeFilters.year) queryParams.set("year", activeFilters.year);
    if (activeFilters.rating) queryParams.set("rating", activeFilters.rating);
    if (activeFilters.duration) queryParams.set("duration", activeFilters.duration);
    if (activeFilters.sortBy) queryParams.set("sortBy", activeFilters.sortBy);

    setPendingQuery(`/movies?${queryParams.toString()}`);

    setLoading(true);
    try {
      const data = await discoverMovies({
        ...activeFilters,
        query: searchQuery,
        page: 1,
      });
      setMovies(data.results.slice(0, 12));

      const years = Array.from(
        new Set<number>(
          data.results
            .map((m: Movie) => m.release_date?.split("-")[0])
            .filter(Boolean)
            .map(Number)
        )
      ).sort((a, b) => b - a);
      setAvailableYears(years);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setShowSuggestions(false);
    }
  };

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      genre: "",
      year: "",
      rating: "",
      duration: "",
      sortBy: "popularity.desc",
    });
  };

  return (
    <section
      className="relative w-full 
  min-h-[70vh] md:min-h-screen 
  bg-gradient-to-br from-black/90 to-indigo-950/80 bg-cover bg-center 
  flex flex-col items-center px-4 md:px-10 py-12 md:py-20"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(15, 15, 26, 0.9), rgba(30, 30, 60, 0.8)), url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1850&q=80')`,
      }}
    >
      <div className="max-w-6xl mx-auto w-full">
        <HeroHeadline />
        <p className="text-gray-300 text-base md:text-xl mb-6 md:mb-10 leading-relaxed text-center max-w-3xl mx-auto">
          Discover hidden gems you didn’t know you’d love. Your ultimate guide
          to movies, tailored for you.
        </p>
        <div className="relative bg-white/10 border border-white/20 rounded-2xl p-2 backdrop-blur-md mb-8 max-w-2xl mx-auto">
          <div className="flex items-center px-4 py-2">
            <Search className="text-gray-400 mr-2" size={20} />
            <input
              type="text"
              placeholder="Search for movies, genres, or actors..."
              className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none px-2 py-2 text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            />
            <button
              className="bg-primary hover:bg-primary/90 transition-all px-6 py-3 rounded-xl font-semibold text-primary-foreground flex items-center ml-2"
              onClick={() => handleSearch()}
              disabled={loading}
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
          {showSuggestions && suggestions.length > 0 && (
            <div
              ref={suggestionsRef}
              className="absolute left-0 right-0 top-full mt-2 bg-black/90 border border-white/20 rounded-lg shadow-lg z-50"
            >
              {suggestions.map((s) => (
                <button
                  key={s.id}
                  className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10"
                  onClick={() => {
                    setSearchQuery(s.name);
                    handleSearch();
                  }}
                >
                  {s.name}
                </button>
              ))}
            </div>
          )}
          <div className="border-t border-white/20 mt-2 pt-2 px-4">
            <button
              className="flex items-center text-gray-300 hover:text-white transition-colors text-sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={16} className="mr-1" />
              Advanced Filters
              <ChevronDown
                size={16}
                className={`ml-1 transition-transform ${
                  showFilters ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
          {showFilters && (
            <div
              ref={filtersRef}
              className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4 p-4 bg-black/30 rounded-lg border border-white/10"
            >
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Genre
                </label>
                <select
                  className="w-full bg-primary/50 border border-primary-foreground/20 rounded-lg px-3 py-2 text-primary-foreground text-sm hover:bg-primary/70 hover:border-primary-foreground/40 transition-colors duration-300"
                  value={filters.genre}
                  onChange={(e) => handleFilterChange("genre", e.target.value)}
                >
                  <option value="">All Genres</option>
                  {genres.map((genre) => (
                    <option key={genre.id} value={genre.id}>
                      {genre.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Year
                </label>
                <select
                  className="w-full bg-primary/50 border border-white/20 rounded-lg px-3 py-2 text-white text-sm hover:bg-primary/70 hover:border-white/40 transition-colors duration-300"
                  value={filters.year}
                  onChange={(e) => handleFilterChange("year", e.target.value)}
                >
                  <option value="">All Years</option>
                  {availableYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Min Rating
                </label>
                <select
                  className="w-full bg-primary/50 border border-white/20 rounded-lg px-3 py-2 text-white text-sm hover:bg-primary/70 hover:border-white/40 transition-colors duration-300"
                  value={filters.rating}
                  onChange={(e) => handleFilterChange("rating", e.target.value)}
                >
                  <option value="">Any Rating</option>
                  {[9, 8, 7, 6, 5].map((r) => (
                    <option key={r} value={r}>
                      {r}+ Stars
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Duration
                </label>
                <select
                  className="w-full bg-primary/50 border border-white/20 rounded-lg px-3 py-2 text-white text-sm hover:bg-primary/70 hover:border-white/40 transition-colors duration-300"
                  value={filters.duration}
                  onChange={(e) =>
                    handleFilterChange("duration", e.target.value)
                  }
                >
                  <option value="">Any Duration</option>
                  <option value="short">Short (&lt; 90min)</option>
                  <option value="medium">Medium (90-120min)</option>
                  <option value="long">Long (&gt; 120min)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Sort By
                </label>
                <select
                  className="w-full bg-primary/50 border border-white/20 rounded-lg px-3 py-2 text-white text-sm hover:bg-primary/70 hover:border-white/40 transition-colors duration-300"
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                >
                  <option value="popularity.desc">Popularity</option>
                  <option value="release_date.desc">Newest</option>
                  <option value="vote_average.desc">Rating</option>
                  <option value="revenue.desc">Box Office</option>
                </select>
              </div>
              <div className="md:col-span-3 lg:col-span-5 flex justify-end mt-2">
                <button
                  className="text-sm text-gray-400 hover:text-white transition-colors flex items-center"
                  onClick={clearFilters}
                >
                  Clear all filters
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-wrap justify-center gap-3 mb-12 max-w-2xl mx-auto">
          <span className="text-gray-300 text-sm">Trending Genres:</span>
          {trendingGenres.map((chip) => {
            const genre = genres.find((g) => g.name === chip);
            return (
              <button
                key={chip}
                className="bg-primary-foreground/10 hover:bg-primary/60 border border-white/20 rounded-full px-4 py-1 text-sm text-gray-300 hover:text-white transition-colors"
                onClick={() => {
                  if (genre) {
                    setSearchQuery("");
                    const newFilters = { ...filters, genre: String(genre.id) };
                    setFilters(newFilters);
                    handleSearch(newFilters);
                  }
                }}
              >
                {chip}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

