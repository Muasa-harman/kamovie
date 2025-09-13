const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = process.env.NEXT_PUBLIC_TMDB_READ_TOKEN!;

// Generic fetch
async function fetchDataFromTMDB(endpoint: string) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json;charset=utf-8",
    },
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`TMDB API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

/**
 * Build query params for discover endpoints
 */
function buildDiscoverParams(filters: {
  query?: string;
  genre?: string;
  year?: string;
  rating?: string;
  duration?: string;
  sortBy?: string;
  page: number;
}) {
  const params = new URLSearchParams();

  params.set("sort_by", filters.sortBy ?? "popularity.desc");
  params.set("page", String(filters.page));
  params.set("include_adult", "false");
  params.set("language", "en-US");

  if (filters.genre) params.set("with_genres", filters.genre);
  if (filters.year) params.set("primary_release_year", filters.year);
  if (filters.rating) params.set("vote_average.gte", filters.rating);
  if (filters.query) params.set("with_keywords", filters.query);

  // Duration filters
  if (filters.duration === "short") {
    params.set("with_runtime.lte", "90");
  } else if (filters.duration === "medium") {
    params.set("with_runtime.gte", "90");
    params.set("with_runtime.lte", "120");
  } else if (filters.duration === "long") {
    params.set("with_runtime.gte", "120");
  }

  return params.toString();
}

// 🔹 Movie Lists
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

// 🔹 Search
export async function searchMovies(query: string, page: number = 1) {
  const data = await fetchDataFromTMDB(
    `/search/movie?query=${encodeURIComponent(query)}&page=${page}&include_adult=false`
  );
  return { results: data.results, totalPages: data.total_pages };
}

// 🔹 Discover Movies
export async function discoverMovies(filters: {
  query?: string;
  genre?: string;
  year?: string;
  rating?: string;
  duration?: string;
  sortBy?: string;
  page: number;
}) {
  const qs = buildDiscoverParams(filters);
  const data = await fetchDataFromTMDB(`/discover/movie?${qs}`);
  return { results: data.results, totalPages: data.total_pages };
}

// 🔹 Discover TV
export async function discoverTV(filters: {
  query?: string;
  genre?: string;
  year?: string;
  rating?: string;
  duration?: string;
  sortBy?: string;
  page: number;
}) {
  const qs = buildDiscoverParams(filters);
  const data = await fetchDataFromTMDB(`/discover/tv?${qs}`);
  return { results: data.results, totalPages: data.total_pages };
}

// 🔹 Generic Details (works for both movies and TV shows)
export async function getMovieDetails(
  type: "movie" | "tv",
  id: number
) {
  return fetchDataFromTMDB(
    `/${type}/${id}?append_to_response=credits,videos,recommendations,similar`
  );
}

// 🔹 Genres
export async function getGenres(type: "movie" | "tv" = "movie") {
  const data = await fetchDataFromTMDB(`/genre/${type}/list?language=en-US`);
  return data.genres;
}

// 🔹 Keywords
export async function getKeywords(query: string) {
  const data = await fetchDataFromTMDB(
    `/search/keyword?query=${encodeURIComponent(query)}`
  );
  return data.results;
}


// const BASE_URL = "https://api.themoviedb.org/3";
// const API_KEY = process.env.NEXT_PUBLIC_TMDB_READ_TOKEN!;

// // Generic fetch
// async function fetchDataFromTMDB(endpoint: string) {
//   const res = await fetch(`${BASE_URL}${endpoint}`, {
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

// /**
//  * Build query params for discover endpoints
//  */
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

//   // Duration filters
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

// // 🔹 Movie Lists
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

// // 🔹 Search
// export async function searchMovies(query: string, page: number = 1) {
//   const data = await fetchDataFromTMDB(
//     `/search/movie?query=${encodeURIComponent(query)}&page=${page}&include_adult=false`
//   );
//   return { results: data.results, totalPages: data.total_pages };
// }

// // 🔹 Discover Movies
// export async function discoverMovies(filters: {
//   query?: string;
//   genre?: string;
//   year?: string;
//   rating?: string;
//   duration?: string;
//   sortBy?: string;
//   page: number;
// }) {
//   const qs = buildDiscoverParams(filters);
//   const data = await fetchDataFromTMDB(`/discover/movie?${qs}`);
//   return { results: data.results, totalPages: data.total_pages };
// }

// // 🔹 Discover TV
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

// // 🔹 Details
// export async function getMovieDetails(id: number) {
//   return fetchDataFromTMDB(`/movie/${id}?append_to_response=credits,videos`);
// }

// // 🔹 Genres
// export async function getGenres() {
//   const data = await fetchDataFromTMDB("/genre/movie/list?language=en-US");
//   return data.genres;
// }

// // 🔹 Keywords
// export async function getKeywords(query: string) {
//   const data = await fetchDataFromTMDB(
//     `/search/keyword?query=${encodeURIComponent(query)}`
//   );
//   return data.results;
// }


// const BASE_URL = "https://api.themoviedb.org/3";
// const API_KEY = process.env.NEXT_PUBLIC_TMDB_READ_TOKEN!;

// // Generic fetch
// async function fetchDataFromTMDB(endpoint: string) {
//   const res = await fetch(`${BASE_URL}${endpoint}`, {
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

// // 🔹 Movie Lists
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

// // 🔹 Search
// export async function searchMovies(query: string, page: number = 1) {
//   const data = await fetchDataFromTMDB(
//     `/search/movie?query=${encodeURIComponent(query)}&page=${page}&include_adult=false`
//   );
//   return { results: data.results, totalPages: data.total_pages };
// }

// // 🔹 Discover with filters
// export async function discoverMovies(filters: {
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

//   // Duration filters
//   if (filters.duration === "short") {
//     params.set("with_runtime.lte", "90");
//   } else if (filters.duration === "medium") {
//     params.set("with_runtime.gte", "90");
//     params.set("with_runtime.lte", "120");
//   } else if (filters.duration === "long") {
//     params.set("with_runtime.gte", "120");
//   }

//   const data = await fetchDataFromTMDB(`/discover/movie?${params.toString()}`);
//   return { results: data.results, totalPages: data.total_pages };
// }

// // 🔹 Details
// export async function getMovieDetails(id: number) {
//   return fetchDataFromTMDB(`/movie/${id}?append_to_response=credits,videos`);
// }

// // 🔹 Genres
// export async function getGenres() {
//   const data = await fetchDataFromTMDB("/genre/movie/list?language=en-US");
//   return data.genres;
// }

// // 🔹 Keywords
// export async function getKeywords(query: string) {
//   const data = await fetchDataFromTMDB(
//     `/search/keyword?query=${encodeURIComponent(query)}`
//   );
//   return data.results;
// }

