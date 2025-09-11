import { discoverMovies, getTrendingMovies } from "@/lib/movieApi";

global.fetch = jest.fn();

describe('movieApi', () => {
  it('calls getTrendingMovies', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => [{ id: 1, title: 'Inception' }],
    });

    const movies = await getTrendingMovies();
    expect(movies).toEqual([{ id: 1, title: 'Inception' }]);
  });

  it('calls discoverMovies with filters', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => [{ id: 2, title: 'Interstellar' }],
    });

    const data = await discoverMovies({ query: 'space', genre: '' });
    expect(data).toEqual([{ id: 2, title: 'Interstellar' }]);
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('space'));
  });
});
