import { Filters } from "./types";

const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = process.env.NEXT_PUBLIC_TMDB_READ_TOKEN!;

type FetchOptions = {
  signal?: AbortSignal;
  force?: boolean; // bypass cache
};

// 🔹 Cache store
type CacheEntry = { data: any; timestamp: number };
const cache = new Map<string, CacheEntry>();

// 🔹 Config
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes
const CLEANUP_INTERVAL = 5 * 60 * 1000; // every 5 minutes
const MAX_CACHE_SIZE = 500; // limit total entries

// ---------------- Cache Cleaner ----------------
function cleanExpiredCache() {
  const now = Date.now();
  let removed = 0;

  for (const [key, entry] of cache.entries()) {
    if (now - entry.timestamp >= CACHE_TTL) {
      cache.delete(key);
      removed++;
    }
  }

  if (removed > 0) {
    console.log(`[TMDB Cache] Cleaned ${removed} expired entries`);
  }
}

// ---------------- Cache Size Enforcer ----------------
function enforceCacheSize() {
  if (cache.size <= MAX_CACHE_SIZE) return;

  const excess = cache.size - MAX_CACHE_SIZE;
  let removed = 0;

  for (const key of cache.keys()) {
    cache.delete(key);
    removed++;
    if (removed >= excess) break;
  }

  console.log(`[TMDB Cache] Removed ${removed} oldest entries to enforce max size`);
}

// Run cleanup periodically
setInterval(() => {
  cleanExpiredCache();
  enforceCacheSize();
}, CLEANUP_INTERVAL);

// ---------------- Generic Fetch ----------------
async function fetchDataFromTMDB(
  endpoint: string,
  params?: Record<string, string | number | undefined>,
  options: FetchOptions = {}
) {
  const url = new URL(`${BASE_URL}${endpoint}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        url.searchParams.set(key, String(value));
      }
    });
  }

  const cacheKey = url.toString();
  const now = Date.now();

  if (!options.force && cache.has(cacheKey)) {
    const entry = cache.get(cacheKey)!;
    if (now - entry.timestamp < CACHE_TTL) {
      return entry.data;
    } else {
      cache.delete(cacheKey);
    }
  }

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json;charset=utf-8",
    },
    signal: options.signal,
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`TMDB API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();

  cache.set(cacheKey, { data, timestamp: now });
  enforceCacheSize();

  return data;
}

// ---------------- Params Builder ----------------
function buildDiscoverParams(filters: Filters, isSearch = false) {
  const params: Record<string, string | number> = {
    sort_by: filters.sortBy ?? "popularity.desc",
    page: filters.page ?? 1,
    include_adult: "false",
    language: "en-US",
  };

  if (filters.genre) params.with_genres = filters.genre;
  if (filters.year) params.primary_release_year = filters.year;
  if (filters.rating) params["vote_average.gte"] = filters.rating;

  if (filters.duration === "short") {
    params["with_runtime.lte"] = "90";
  } else if (filters.duration === "medium") {
    params["with_runtime.gte"] = "90";
    params["with_runtime.lte"] = "120";
  } else if (filters.duration === "long") {
    params["with_runtime.gte"] = "120";
  }

  if (isSearch && filters.query) {
    params.query = filters.query;
  }

  return params;
}

// ---------------- API Functions ----------------
export async function getTrendingMovies() {
  const data = await fetchDataFromTMDB("/trending/movie/week");
  return data.results;
}

export async function getPopularMovies() {
  const data = await fetchDataFromTMDB("/movie/popular");
  return data.results;
}

export async function getTopRatedMovies() {
  const data = await fetchDataFromTMDB("/movie/top_rated");
  return data.results;
}

export async function getUpcomingMovies() {
  const data = await fetchDataFromTMDB("/movie/upcoming");
  return data.results;
}

export async function searchMovies(query: string, page = 1) {
  const data = await fetchDataFromTMDB("/search/movie", {
    query,
    page,
    include_adult: "false",
  });
  return { results: data.results, totalPages: data.total_pages };
}

export async function discoverMovies(filters: Filters) {
  const isSearch =
    Boolean(filters.query) &&
    !filters.genre &&
    !filters.year &&
    !filters.rating;

  const params = buildDiscoverParams(filters, isSearch);
  const endpoint = isSearch ? "/search/movie" : "/discover/movie";

  const data = await fetchDataFromTMDB(endpoint, params);
  return { results: data.results, totalPages: data.total_pages };
}

export async function discoverTV(filters: Filters) {
  const params = buildDiscoverParams(filters);
  const endpoint = filters.query ? "/search/tv" : "/discover/tv";
  const data = await fetchDataFromTMDB(endpoint, params);
  return { results: data.results, totalPages: data.total_pages };
}

export async function getMovieDetails(type: "movie" | "tv", id: number) {
  return fetchDataFromTMDB(`/${type}/${id}`, {
    append_to_response: "credits,videos,recommendations,similar",
  });
}

export async function getGenres(type: "movie" | "tv" = "movie") {
  const data = await fetchDataFromTMDB(`/genre/${type}/list`, {
    language: "en-US",
  });
  return data.genres;
}

export async function getKeywords(query: string) {
  const data = await fetchDataFromTMDB("/search/keyword", { query });
  return data.results;
}



// import { Filters } from "./types";

// const BASE_URL = "https://api.themoviedb.org/3";
// const API_KEY = process.env.NEXT_PUBLIC_TMDB_READ_TOKEN!;

// type FetchOptions = {
//   signal?: AbortSignal;
//   force?: boolean; // bypass cache
// };

// // 🔹 Cache store
// type CacheEntry = { data: any; timestamp: number };
// const cache = new Map<string, CacheEntry>();

// // 🔹 Config
// const CACHE_TTL = 10 * 60 * 1000; // 10 minutes
// const CLEANUP_INTERVAL = 5 * 60 * 1000; // every 5 minutes
// const MAX_CACHE_SIZE = 500; // limit total entries

// // ---------------- Cache Cleaner ----------------
// function cleanExpiredCache() {
//   const now = Date.now();
//   let removed = 0;

//   for (const [key, entry] of cache.entries()) {
//     if (now - entry.timestamp >= CACHE_TTL) {
//       cache.delete(key);
//       removed++;
//     }
//   }

//   if (removed > 0) {
//     console.log(`[TMDB Cache] Cleaned ${removed} expired entries`);
//   }
// }

// // ---------------- Cache Size Enforcer ----------------
// function enforceCacheSize() {
//   if (cache.size <= MAX_CACHE_SIZE) return;

//   // Remove oldest entries (FIFO based on Map iteration order)
//   const excess = cache.size - MAX_CACHE_SIZE;
//   let removed = 0;

//   for (const key of cache.keys()) {
//     cache.delete(key);
//     removed++;
//     if (removed >= excess) break;
//   }

//   console.log(`[TMDB Cache] Removed ${removed} oldest entries to enforce max size`);
// }

// // Run cleanup periodically
// setInterval(() => {
//   cleanExpiredCache();
//   enforceCacheSize();
// }, CLEANUP_INTERVAL).unref();

// // ---------------- Generic Fetch ----------------
// async function fetchDataFromTMDB(
//   endpoint: string,
//   params?: Record<string, string | number | undefined>,
//   options: FetchOptions = {}
// ) {
//   const url = new URL(`${BASE_URL}${endpoint}`);

//   if (params) {
//     Object.entries(params).forEach(([key, value]) => {
//       if (value !== undefined && value !== "") {
//         url.searchParams.set(key, String(value));
//       }
//     });
//   }

//   const cacheKey = url.toString();
//   const now = Date.now();

//   if (!options.force && cache.has(cacheKey)) {
//     const entry = cache.get(cacheKey)!;
//     if (now - entry.timestamp < CACHE_TTL) {
//       return entry.data; 
//     } else {
//       cache.delete(cacheKey);
//     }
//   }

//   const res = await fetch(url.toString(), {
//     headers: {
//       Authorization: `Bearer ${API_KEY}`,
//       "Content-Type": "application/json;charset=utf-8",
//     },
//     signal: options.signal,
//     next: { revalidate: 3600 },
//   });

//   if (!res.ok) {
//     throw new Error(`TMDB API error: ${res.status} ${res.statusText}`);
//   }

//   const data = await res.json();

//   cache.set(cacheKey, { data, timestamp: now });

//   enforceCacheSize();

//   return data;
// }



// import { Filters } from "./types";

// const BASE_URL = "https://api.themoviedb.org/3";
// const API_KEY = process.env.NEXT_PUBLIC_TMDB_READ_TOKEN!;

// // ---------------- Generic Fetch ----------------
// async function fetchDataFromTMDB(
//   endpoint: string,
//   params?: Record<string, string | number | undefined>
// ) {
//   const url = new URL(`${BASE_URL}${endpoint}`);

//   if (params) {
//     Object.entries(params).forEach(([key, value]) => {
//       if (value !== undefined && value !== "") {
//         url.searchParams.set(key, String(value));
//       }
//     });
//   }

//   const res = await fetch(url.toString(), {
//     headers: {
//       Authorization: `Bearer ${API_KEY}`,
//       "Content-Type": "application/json;charset=utf-8",
//     },
//     next: { revalidate: 3600 }, // ISR caching
//   });

//   if (!res.ok) {
//     throw new Error(`TMDB API error: ${res.status} ${res.statusText}`);
//   }

//   return res.json();
// }

// // ---------------- Params Builder ----------------
// function buildDiscoverParams(filters: Filters) {
//   const params: Record<string, string | number> = {
//     sort_by: filters.sortBy ?? "popularity.desc",
//     page: filters.page ?? 1,
//     include_adult: "false",
//     language: "en-US",
//   };

//   if (filters.genre) params.with_genres = filters.genre;
//   if (filters.year) params.primary_release_year = filters.year;
//   if (filters.rating) params["vote_average.gte"] = filters.rating;

//   if (filters.duration === "short") {
//     params["with_runtime.lte"] = "90";
//   } else if (filters.duration === "medium") {
//     params["with_runtime.gte"] = "90";
//     params["with_runtime.lte"] = "120";
//   } else if (filters.duration === "long") {
//     params["with_runtime.gte"] = "120";
//   }

//   if (filters.query) {
//     // Search mode → TMDB expects "query" instead of discover params
//     params.query = filters.query;
//   }

//   return params;
// }

// // ---------------- API Functions ----------------

// export async function getTrendingMovies() {
//   const data = await fetchDataFromTMDB("/trending/movie/week");
//   return data.results;
// }

// export async function getPopularMovies() {
//   const data = await fetchDataFromTMDB("/movie/popular");
//   return data.results;
// }

// export async function getTopRatedMovies() {
//   const data = await fetchDataFromTMDB("/movie/top_rated");
//   return data.results;
// }

// export async function getUpcomingMovies() {
//   const data = await fetchDataFromTMDB("/movie/upcoming");
//   return data.results;
// }

// export async function searchMovies(query: string, page = 1) {
//   const data = await fetchDataFromTMDB("/search/movie", {
//     query,
//     page,
//     include_adult: "false",
//   });
//   return { results: data.results, totalPages: data.total_pages };
// }

// export async function discoverMovies(filters: Filters) {
//   const params = buildDiscoverParams(filters);
//   const endpoint = filters.query ? "/search/movie" : "/discover/movie";
//   const data = await fetchDataFromTMDB(endpoint, params);
//   return { results: data.results, totalPages: data.total_pages };
// }

// export async function discoverTV(filters: Filters) {
//   const params = buildDiscoverParams(filters);
//   const endpoint = filters.query ? "/search/tv" : "/discover/tv";
//   const data = await fetchDataFromTMDB(endpoint, params);
//   return { results: data.results, totalPages: data.total_pages };
// }

// export async function getMovieDetails(type: "movie" | "tv", id: number) {
//   return fetchDataFromTMDB(`/${type}/${id}`, {
//     append_to_response: "credits,videos,recommendations,similar",
//   });
// }

// export async function getGenres(type: "movie" | "tv" = "movie") {
//   const data = await fetchDataFromTMDB(`/genre/${type}/list`, {
//     language: "en-US",
//   });
//   return data.genres;
// }

// export async function getKeywords(query: string) {
//   const data = await fetchDataFromTMDB("/search/keyword", { query });
//   return data.results;
// }



// import { Filters } from "./types";

// // movieApi.ts
// const BASE_URL = "https://api.themoviedb.org/3";
// const API_KEY = process.env.NEXT_PUBLIC_TMDB_READ_TOKEN!;

// // Generic fetch
// async function fetchDataFromTMDB(endpoint: string) {
//   const res = await fetch(`${BASE_URL}${endpoint}`, {
//     headers: {
//       Authorization: `Bearer ${API_KEY}`,
//       "Content-Type": "application/json;charset=utf-8",
//     },
//     next: { revalidate: 3600 }, // ISR caching
//   });

//   if (!res.ok) {
//     throw new Error(`TMDB API error: ${res.status} ${res.statusText}`);
//   }

//   return res.json();
// }

// // Build query string for discover/search
// function buildDiscoverParams(filters: Filters) {
//   const params = new URLSearchParams();

//   params.set("sort_by", filters.sortBy ?? "popularity.desc");
//   params.set("page", String(filters.page ?? 1));
//   params.set("include_adult", "false");
//   params.set("language", "en-US");

//   if (filters.genre) params.set("with_genres", filters.genre);
//   if (filters.year) params.set("primary_release_year", filters.year);
//   if (filters.rating) params.set("vote_average.gte", filters.rating);

//   if (filters.duration === "short") {
//     params.set("with_runtime.lte", "90");
//   } else if (filters.duration === "medium") {
//     params.set("with_runtime.gte", "90");
//     params.set("with_runtime.lte", "120");
//   } else if (filters.duration === "long") {
//     params.set("with_runtime.gte", "120");
//   }

//   if (filters.query) {
//     // If user searched with a keyword, it’s a search endpoint param
//     params.set("query", filters.query);
//   }

//   return params.toString();
// }

// // --------------------------- API functions ---------------------------

// export async function getTrendingMovies() {
//   const data = await fetchDataFromTMDB("/trending/movie/week");
//   return data.results;
// }

// export async function getPopularMovies() {
//   const data = await fetchDataFromTMDB("/movie/popular");
//   return data.results;
// }

// export async function getTopRatedMovies() {
//   const data = await fetchDataFromTMDB("/movie/top_rated");
//   return data.results;
// }

// export async function getUpcomingMovies() {
//   const data = await fetchDataFromTMDB("/movie/upcoming");
//   return data.results;
// }

// export async function searchMovies(query: string, page = 1) {
//   const data = await fetchDataFromTMDB(
//     `/search/movie?query=${encodeURIComponent(query)}&page=${page}&include_adult=false`
//   );
//   return { results: data.results, totalPages: data.total_pages };
// }

// export async function discoverMovies(filters: Filters) {
//   const qs = buildDiscoverParams(filters);
//   const endpoint = filters.query ? "/search/movie" : "/discover/movie";
//   const data = await fetchDataFromTMDB(`${endpoint}?${qs}`);
//   return { results: data.results, totalPages: data.total_pages };
// }

// export async function discoverTV(filters: Filters) {
//   const qs = buildDiscoverParams(filters);
//   const endpoint = filters.query ? "/search/tv" : "/discover/tv";
//   const data = await fetchDataFromTMDB(`${endpoint}?${qs}`);
//   return { results: data.results, totalPages: data.total_pages };
// }

// export async function getMovieDetails(type: "movie" | "tv", id: number) {
//   return fetchDataFromTMDB(
//     `/${type}/${id}?append_to_response=credits,videos,recommendations,similar`
//   );
// }

// export async function getGenres(type: "movie" | "tv" = "movie") {
//   const data = await fetchDataFromTMDB(`/genre/${type}/list?language=en-US`);
//   return data.genres;
// }

// export async function getKeywords(query: string) {
//   const data = await fetchDataFromTMDB(
//     `/search/keyword?query=${encodeURIComponent(query)}`
//   );
//   return data.results;
// }



// import { Filters } from "./types";

// const BASE_URL = "https://api.themoviedb.org/3";
// const API_KEY = process.env.NEXT_PUBLIC_TMDB_READ_TOKEN!;

// async function fetchDataFromTMDB(endpoint: string, params?: Record<string, string>) {
//   const url = new URL(`${BASE_URL}${endpoint}`);

//   if (params) {
//     Object.entries(params).forEach(([key, value]) => {
//       if (value) url.searchParams.set(key, value);
//     });
//   }

//   const res = await fetch(url.toString(), {
//     headers: {
//       Authorization: `Bearer ${API_KEY}`,
//       "Content-Type": "application/json;charset=utf-8",
//     },
//     next: { revalidate: 3600 },
//   });

//   if (!res.ok) {
//     throw new Error(`TMDB API error: ${res.status} ${res.statusText}`);
//   }

//   return res.json();
// }



// function buildDiscoverParams(filters: {
//   query?: string;
//   genre?: string;
//   year?: string;
//   rating?: string;
//   duration?: string;
//   sortBy?: string;
//   page: number;
// }) {
//   const params = new URLSearchParams();

//   params.set("sort_by", filters.sortBy ?? "popularity.desc");
//   params.set("page", String(filters.page));
//   params.set("include_adult", "false");
//   params.set("language", "en-US");

//   if (filters.genre) params.set("with_genres", filters.genre);
//   if (filters.year) params.set("primary_release_year", filters.year);
//   if (filters.rating) params.set("vote_average.gte", filters.rating);
//   if (filters.query) params.set("with_keywords", filters.query);

//   if (filters.duration === "short") {
//     params.set("with_runtime.lte", "90");
//   } else if (filters.duration === "medium") {
//     params.set("with_runtime.gte", "90");
//     params.set("with_runtime.lte", "120");
//   } else if (filters.duration === "long") {
//     params.set("with_runtime.gte", "120");
//   }

//   return params.toString();
// }

// export async function getTrendingMovies() {
//   const data = await fetchDataFromTMDB("/trending/movie/week");
//   return data.results;
// }

// export async function getPopularMovies() {
//   const data = await fetchDataFromTMDB("/movie/popular");
//   return data.results;
// }

// export async function getTopRatedMovies() {
//   const data = await fetchDataFromTMDB("/movie/top_rated");
//   return data.results;
// }

// export async function getUpcomingMovies() {
//   const data = await fetchDataFromTMDB("/movie/upcoming");
//   return data.results;
// }

// export async function searchMovies(query: string, page: number = 1) {
//   const data = await fetchDataFromTMDB(
//     `/search/movie?query=${encodeURIComponent(query)}&page=${page}&include_adult=false`
//   );
//   return { results: data.results, totalPages: data.total_pages };
// }


// export async function discoverMovies(filters: Filters & { query?: string; page?: number }) {
//   const params: Record<string, string> = {
//     page: String(filters.page || 1),
//     sort_by: filters.sortBy || "popularity.desc",
//     include_adult: "false",
//   };

//   if (filters.genre) params.with_genres = filters.genre;
//   if (filters.year) params.primary_release_year = filters.year;
//   if (filters.rating) params["vote_average.gte"] = filters.rating;

//   if (filters.duration === "short") params["with_runtime.lte"] = "90";
//   if (filters.duration === "medium") {
//     params["with_runtime.gte"] = "90";
//     params["with_runtime.lte"] = "120";
//   }
//   if (filters.duration === "long") params["with_runtime.gte"] = "120";

//   let endpoint = "/discover/movie";
//   if (filters.query) {
//     endpoint = "/search/movie";
//     params.query = filters.query;
//   }
//   const qs = new URLSearchParams(params).toString();
//   const data = await fetchDataFromTMDB(`${endpoint}?${qs}`);

//   // const data = await fetchDataFromTMDB(endpoint, params);
//   return { results: data.results, totalPages: data.total_pages};
// }


// export async function discoverTV(filters: {
//   query?: string;
//   genre?: string;
//   year?: string;
//   rating?: string;
//   duration?: string;
//   sortBy?: string;
//   page: number;
// }) {
//   const qs = buildDiscoverParams(filters);
//   const data = await fetchDataFromTMDB(`/discover/tv?${qs}`);
//   return { results: data.results, totalPages: data.total_pages };
// }

// export async function getMovieDetails(
//   type: "movie" | "tv",
//   id: number
// ) {
//   return fetchDataFromTMDB(
//     `/${type}/${id}?append_to_response=credits,videos,recommendations,similar`
//   );
// }

// export async function getGenres(type: "movie" | "tv" = "movie") {
//   const data = await fetchDataFromTMDB(`/genre/${type}/list?language=en-US`);
//   return data.genres;
// }

// export async function getKeywords(query: string) {
//   const data = await fetchDataFromTMDB(
//     `/search/keyword?query=${encodeURIComponent(query)}`
//   );
//   return data.results;
// }

