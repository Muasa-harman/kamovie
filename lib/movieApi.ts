const BASE_URL = "https://api.themoviedb.org/3";
const TOKEN = process.env.NEXT_PUBLIC_TMDB_READ_TOKEN!;

async function fetchDataFromTMDB(endpoint: string) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json;charset=utf-8",
    },
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`TMDB API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}
console.log("api endpoint", fetchDataFromTMDB)

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

export async function searchMovies(query: string) {
  const data = await fetchDataFromTMDB(
    `/search/movie?query=${encodeURIComponent(query)}&include_adult=false`
  );
  return data.results;
}


export async function discoverMovies(filters: {
  query?: string;
  genre?: string;
  year?: string;
  rating?: string;
  duration?: string;
  sortBy?: string;
}) {
  const params = new URLSearchParams();

  if (filters.query) params.set("with_keywords", encodeURIComponent(filters.query));
  if (filters.genre) params.set("with_genres", filters.genre);
  if (filters.year) params.set("primary_release_year", filters.year);
  if (filters.rating) params.set("vote_average.gte", filters.rating);
  if (filters.duration === "short") {
    params.set("with_runtime.lte", "90");
  } else if (filters.duration === "medium") {
    params.set("with_runtime.gte", "90");
    params.set("with_runtime.lte", "120");
  } else if (filters.duration === "long") {
    params.set("with_runtime.gte", "120");
  }

  params.set("sort_by", filters.sortBy || "popularity.desc");

  // always exclude adult
  params.set("include_adult", "false");
  params.set("language", "en-US");
  params.set("page", "1");

  const data = await fetchDataFromTMDB(`/discover/movie?${params.toString()}`);
  return data.results;
}

export async function getMovieDetails(id: number) {
  return fetchDataFromTMDB(`/movie/${id}?append_to_response=credits,videos`);
}


export async function getGenres() {
  const data = await fetchDataFromTMDB("/genre/movie/list?language=en-US");
  return data.genres; // returns [{ id, name }]
}

export async function getKeywords(query: string) {
  const data = await fetchDataFromTMDB(
    `/search/keyword?query=${encodeURIComponent(query)}`
  );
  return data.results; 
}
