const BASE_URL = "https://api.themoviedb.org/3";
const TOKEN = process.env.NEXT_PUBLIC_TMDB_READ_TOKEN!;

/**
 * Generic fetch wrapper for TMDB
 */
async function fetchFromTMDB(endpoint: string) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json;charset=utf-8",
    },
    next: { revalidate: 3600 }, // cache 1 hour
  });

  if (!res.ok) {
    throw new Error(`TMDB API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

/**
 * Get trending movies (weekly)
 */
export async function getTrendingMovies() {
  const data = await fetchFromTMDB("/trending/movie/week");
  return data.results;
}

export async function getPopularMovies() {
  const data = await fetchFromTMDB("/movie/popular");
  return data.results;
}

export async function getTopRatedMovies() {
  const data = await fetchFromTMDB("/movie/top_rated");
  return data.results;
}

export async function getUpcomingMovies() {
  const data = await fetchFromTMDB("/movie/upcoming");
  return data.results;
}

/**
 * Search for movies by query
 */
export async function searchMovies(query: string) {
  const data = await fetchFromTMDB(`/search/movie?query=${encodeURIComponent(query)}`);
  return data.results;
}

/**
 * Get movie details by ID
 */
export async function getMovieDetails(id: number) {
  return fetchFromTMDB(`/movie/${id}?append_to_response=credits,videos`);
}
