"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  Star,
  Calendar,
  Clock,
  Grid3X3,
} from "lucide-react";
import {
  getTrendingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  discoverMovies,
  getGenres,
  getKeywords,
} from "@/lib/movieApi";

export default function Hero() {
  const [movies, setMovies] = useState<any[]>([]);
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    genre: "",
    year: "",
    rating: "",
    duration: "",
    sortBy: "popularity.desc",
  });
  const [stats, setStats] = useState({
    trending: 0,
    popular: 0,
    topRated: 0,
    upcoming: 0,
  });
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [trendingGenres, setTrendingGenres] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filtersRef = useRef<HTMLDivElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Close filters/suggestions on outside click
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

  // Load initial data
  useEffect(() => {
    async function loadData() {
      try {
        const [trending, popular, topRated, upcoming, genreList] =
          await Promise.all([
            getTrendingMovies(),
            getPopularMovies(),
            getTopRatedMovies(),
            getUpcomingMovies(),
            getGenres(),
          ]);

        setMovies(trending.slice(0, 12));
        setGenres(genreList);

        setStats({
          trending: trending.length,
          popular: popular.length,
          topRated: topRated.length,
          upcoming: upcoming.length,
        });

        // Years dynamically from trending
        const years = Array.from(
          new Set(
            trending
              .map((m: any) => m.release_date?.split("-")[0])
              .filter(Boolean)
              .map(Number)
          )
        ).sort((a, b) => b - a);
        setAvailableYears(years);

        // Trending genres
        const genreCounts: Record<string, number> = {};
        trending.forEach((m: any) => {
          m.genre_ids.forEach((gid: number) => {
            const g = genreList.find((gn) => gn.id === gid);
            if (g) genreCounts[g.name] = (genreCounts[g.name] || 0) + 1;
          });
        });
        const topGenres = Object.entries(genreCounts)
          .sort((a, b) => b[1] - a[1])
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

  // Autocomplete keyword suggestions
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      getKeywords(searchQuery)
        .then((data) => {
          setSuggestions(data.slice(0, 6));
          setShowSuggestions(true);
        })
        .catch(console.error);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  const handleSearch = () => {
    setLoading(true);
    discoverMovies({ ...filters, query: searchQuery })
      .then((data) => {
        setMovies(data.slice(0, 12));

        // Update years
        const years = Array.from(
          new Set(
            data
              .map((m: any) => m.release_date?.split("-")[0])
              .filter(Boolean)
              .map(Number)
          )
        ).sort((a, b) => b - a);
        setAvailableYears(years);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
    setShowSuggestions(false);
  };

  const handleFilterChange = (key: string, value: string) => {
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
      className="relative min-h-screen w-full bg-gradient-to-br from-black/90 to-indigo-950/80 bg-cover bg-center flex flex-col items-center px-6 md:px-10 py-20"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(15, 15, 26, 0.9), rgba(30, 30, 60, 0.8)), url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1850&q=80')`,
      }}
    >
      <div className="max-w-6xl mx-auto w-full">
        {/* Headline */}
        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 text-center">
          Discover Your Next <span className="text-primary">Favorite</span> Movie
        </h1>

        {/* Description */}
        <p className="text-gray-300 text-lg md:text-xl mb-10 leading-relaxed text-center max-w-3xl mx-auto">
          Get personalized movie recommendations based on your preferences. From
          classic cinema to the latest blockbusters, we’ll help you find the
          perfect movie for any mood.
        </p>

        {/* Search Box */}
        <div className="relative bg-white/10 border border-white/20 rounded-2xl p-2 backdrop-blur-md mb-8 max-w-2xl mx-auto">
          <div className="flex items-center px-4 py-2">
            <Search className="text-gray-400 mr-2" size={20} />
            <input
              type="text"
              placeholder="Search for movies, genres, or actors..."
              className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none px-2 py-2 text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            />
            <button
              className="bg-primary hover:bg-primary/90 transition-all px-6 py-3 rounded-xl font-semibold text-primary-foreground flex items-center ml-2"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>

          {/* Suggestions Dropdown */}
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

          {/* Filter Toggle */}
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

          {/* Filters */}
          {showFilters && (
            <div
              ref={filtersRef}
              className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4 p-4 bg-black/30 rounded-lg border border-white/10"
            >
              {/* Genre */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Genre
                </label>
                <select
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
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

              {/* Year */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Year
                </label>
                <select
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
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

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Min Rating
                </label>
                <select
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
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

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Duration
                </label>
                <select
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
                  value={filters.duration}
                  onChange={(e) => handleFilterChange("duration", e.target.value)}
                >
                  <option value="">Any Duration</option>
                  <option value="short">Short (&lt; 90min)</option>
                  <option value="medium">Medium (90-120min)</option>
                  <option value="long">Long (&gt; 120min)</option>
                </select>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Sort By
                </label>
                <select
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                >
                  <option value="popularity.desc">Popularity</option>
                  <option value="release_date.desc">Newest</option>
                  <option value="vote_average.desc">Rating</option>
                  <option value="revenue.desc">Box Office</option>
                </select>
              </div>

              {/* Clear */}
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

        {/* Trending Genres Chips */}
        <div className="flex flex-wrap justify-center gap-3 mb-12 max-w-2xl mx-auto">
          <span className="text-gray-300 text-sm">Trending Genres:</span>
          {trendingGenres.map((chip) => (
            <button
              key={chip}
              className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-full px-4 py-1 text-sm text-gray-300 hover:text-white transition-colors"
              onClick={() => {
                setSearchQuery(chip);
                handleSearch();
              }}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-gray-300 mb-12">
          <div>
            <p className="text-3xl font-bold">{stats.trending}</p>
            <p className="text-sm">Trending</p>
          </div>
          <div>
            <p className="text-3xl font-bold">{stats.popular}</p>
            <p className="text-sm">Popular</p>
          </div>
          <div>
            <p className="text-3xl font-bold">{stats.topRated}</p>
            <p className="text-sm">Top Rated</p>
          </div>
          <div>
            <p className="text-3xl font-bold">{stats.upcoming}</p>
            <p className="text-sm">Upcoming</p>
          </div>
        </div>

        {/* Movies Grid
        {!loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="bg-white/5 rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform"
              >
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-72 object-cover"
                />
                <div className="p-3">
                  <h3 className="text-white font-semibold text-lg truncate">
                    {movie.title}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {movie.release_date?.split("-")[0]} • ⭐{" "}
                    {movie.vote_average?.toFixed(1)}
                  </p>
                </div>
              </div>
            ))} */}
          {/* </div> */}
        {/* )} */}
      </div>
    </section>
  );
}



