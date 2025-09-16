import { FetchOptions, Filters } from "./types";

const BASE_URL_V3 = "https://api.themoviedb.org/3";
const BASE_URL_V4 = "https://api.themoviedb.org/4/auth/request_token";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_READ_TOKEN!;
const V4_ACCESS_TOKEN = process.env.TMDB_V4_ACCESS_TOKEN!;
const V3_READ_TOKEN = process.env.TMDB_READ_ACCESS_TOKEN!;

export const cache = new Map<string, { data: any; timestamp: number }>();

const CACHE_TTL = 10 * 60 * 1000;
const CLEANUP_INTERVAL = 5 * 60 * 1000;
const MAX_CACHE_SIZE = 500;

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

function enforceCacheSize() {
  if (cache.size <= MAX_CACHE_SIZE) return;

  const excess = cache.size - MAX_CACHE_SIZE;
  let removed = 0;

  for (const key of cache.keys()) {
    cache.delete(key);
    removed++;
    if (removed >= excess) break;
  }

  console.log(
    `[TMDB Cache] Removed ${removed} oldest entries to enforce max size`
  );
}

setInterval(() => {
  cleanExpiredCache();
  enforceCacheSize();
}, CLEANUP_INTERVAL);

async function fetchDataFromTMDB(
  endpoint: string,
  params?: Record<string, string | number | undefined>,
  options: FetchOptions = {}
) {
  const url = new URL(`${BASE_URL_V3}${endpoint}`);

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

export async function createRequestToken(redirectTo: string) {
  const res = await fetch(
    `https://api.themoviedb.org/3/authentication/token/new?api_key=${process.env.TMDB_API_KEY_V3}`
  );

  const data = await res.json();
  console.log("TMDB v3 request_token response:", data);

  if (data.success) {
    data.redirectUrl = `https://www.themoviedb.org/authenticate/${data.request_token}?redirect_to=${redirectTo}`;
  }

  return data;
}

export async function exchangeAccessToken(request_token: string) {
  const res = await fetch(`${BASE_URL_V4}/access_token`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${V4_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ request_token }),
  });
  return res.json();
}

export async function revokeAccessToken(access_token: string) {
  const res = await fetch(`${BASE_URL_V4}/access_token`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${V4_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ access_token }),
  });
  return res.json();
}

export async function getUserInfo(access_token: string) {
  const res = await fetch("https://api.themoviedb.org/3/account", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch user info: ${res.status}`);
  }

  const user = await res.json();

  return {
    id: user.id,
    username: user.username,
    name: user.name || user.username,
    avatar: user.avatar?.tmdb?.avatar_path
      ? `https://image.tmdb.org/t/p/w200${user.avatar.tmdb.avatar_path}`
      : undefined,
  };
}

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

export async function getTrendingMovies() {
  const data = await fetchDataFromTMDB("/trending/movie/week");
  return data.results;
}

export async function getRecommendedTVShows() {
  const data = await fetchDataFromTMDB("/discover/tv");
  return data.results;
}
export async function getRecommendedMovies() {
  const data = await fetchDataFromTMDB("/discover/movie");
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

  let endpoint = "/discover/movie";

  if (filters.query && !isSearch) {
    params.with_keywords = filters.query;
  }

  if (isSearch) {
    endpoint = "/search/movie";
  }

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
