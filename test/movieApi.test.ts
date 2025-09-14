import { 
  discoverMovies, 
  getTrendingMovies, 
  cache 
} from "@/lib/movieApi";

global.fetch = jest.fn();

describe("movieApi", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    cache.clear(); // always start fresh
  });

  it("calls getTrendingMovies and returns results", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: "OK",
      json: async () => ({
        results: [{ id: 1, title: "Inception" }],
      }),
    });

    const movies = await getTrendingMovies();

    expect(movies).toEqual([{ id: 1, title: "Inception" }]);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/trending/movie/week"),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: expect.stringContaining("Bearer"),
        }),
      })
    );
  });

  it("calls discoverMovies with filters and returns results", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: "OK",
      json: async () => ({
        results: [{ id: 2, title: "Interstellar" }],
        total_pages: 10,
      }),
    });

    const data = await discoverMovies({ 
      query: "space", 
      genre: "1", 
      year: "2023",
      page: 1 
    });

    expect(data).toEqual({
      results: [{ id: 2, title: "Interstellar" }],
      totalPages: 10,
    });

    const calledUrl = (fetch as jest.Mock).mock.calls[0][0] as string;
    expect(calledUrl).toContain("/discover/movie?");
    expect(calledUrl).toContain("with_genres=1");
    expect(calledUrl).toContain("primary_release_year=2023");
  });

  it("calls discoverMovies in search mode when only query is provided", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: "OK",
      json: async () => ({
        results: [{ id: 3, title: "Gravity" }],
        total_pages: 5,
      }),
    });

    const data = await discoverMovies({ query: "space", page: 1 });

    expect(data).toEqual({
      results: [{ id: 3, title: "Gravity" }],
      totalPages: 5,
    });

    const calledUrl = (fetch as jest.Mock).mock.calls[0][0] as string;
    expect(calledUrl).toContain("/search/movie?");
    expect(calledUrl).toContain("query=space");
  });

  it("applies duration filters correctly", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: "OK",
      json: async () => ({
        results: [],
        total_pages: 1,
      }),
    });

    await discoverMovies({ duration: "long", page: 1 });

    const calledUrl = (fetch as jest.Mock).mock.calls[0][0] as string;
    expect(calledUrl).toContain("with_runtime.gte=120");
  });

  it("throws error if fetch fails", async () => {
    cache.clear(); // make sure no cached value is used

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
      json: async () => ({}),
    });

    await expect(getTrendingMovies()).rejects.toThrow(
      "TMDB API error: 500 Internal Server Error"
    );
  });
});



// import { discoverMovies, getTrendingMovies,cache } from "@/lib/movieApi";


// global.fetch = jest.fn();

// describe("movieApi", () => {
//   beforeEach(() => {
//     jest.resetAllMocks();
//     cache.clear()
//   });

//   it("calls getTrendingMovies and returns results", async () => {
//     (fetch as jest.Mock).mockResolvedValueOnce({
//       ok: true,
//       status: 200,
//       statusText: "OK",
//       json: async () => ({
//         results: [{ id: 1, title: "Inception" }],
//       }),
//     });

//     const movies = await getTrendingMovies();

//     expect(movies).toEqual([{ id: 1, title: "Inception" }]);
//     expect(fetch).toHaveBeenCalledWith(
//       expect.stringContaining("/trending/movie/week"),
//       expect.objectContaining({
//         headers: expect.objectContaining({
//           Authorization: expect.stringContaining("Bearer"),
//         }),
//       })
//     );
//   });

//   it("calls discoverMovies with filters and returns results", async () => {
//     (fetch as jest.Mock).mockResolvedValueOnce({
//       ok: true,
//       status: 200,
//       statusText: "OK",
//       json: async () => ({
//         results: [{ id: 2, title: "Interstellar" }],
//       }),
//     });

//     const data = await discoverMovies({ query: "space", genre: "1", year: "2023",page:1 });

//     expect(data).toEqual({
//       results: [{ id: 2, title: "Interstellar" }],
//       totalPages: undefined,
//     });
//     expect(fetch).toHaveBeenCalledWith(
//       expect.stringContaining("/discover/movie?"),
//       expect.objectContaining({
//         headers: expect.objectContaining({
//           Authorization: expect.stringContaining("Bearer"),
//         }),
//       })
//     );

//     const calledUrl = (fetch as jest.Mock).mock.calls[0][0] as string;
//     expect(calledUrl).toContain("with_keywords=space");
//     expect(calledUrl).toContain("with_genres=1");
//     expect(calledUrl).toContain("primary_release_year=2023");
//   });

//   it("throws error if fetch fails", async () => {
//     (fetch as jest.Mock).mockResolvedValueOnce({
//       ok: false,
//       status: 500,
//       statusText: "Internal Server Error",
//       json: async () => ({}),
//     });

//     await expect(getTrendingMovies()).rejects.toThrow("TMDB API error: 500 Internal Server Error");
//   });
// });
