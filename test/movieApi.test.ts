import { discoverMovies, getTrendingMovies } from "@/lib/movieApi";

global.fetch = jest.fn();

describe("movieApi", () => {
  beforeEach(() => {
    jest.resetAllMocks();
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
      }),
    });

    const data = await discoverMovies({ query: "space", genre: "1", year: "2023" });

    expect(data).toEqual([{ id: 2, title: "Interstellar" }]);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/discover/movie?"),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: expect.stringContaining("Bearer"),
        }),
      })
    );

    const calledUrl = (fetch as jest.Mock).mock.calls[0][0] as string;
    expect(calledUrl).toContain("with_keywords=space");
    expect(calledUrl).toContain("with_genres=1");
    expect(calledUrl).toContain("primary_release_year=2023");
  });

  it("throws error if fetch fails", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
      json: async () => ({}),
    });

    await expect(getTrendingMovies()).rejects.toThrow("TMDB API error: 500 Internal Server Error");
  });
});
