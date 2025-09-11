// import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// import * as movieApi from '@/lib/movieApi';
// import Hero from '@/components/hero/Hero';

// jest.mock('@/lib/movieApi');

// describe('Hero Component', () => {
//   beforeEach(() => {
//     jest.resetAllMocks();

//     (movieApi.getTrendingMovies as jest.Mock).mockResolvedValue([
//       { id: 1, title: 'Movie 1', genre_ids: [1], release_date: '2025-01-01' },
//     ]);
//     (movieApi.getPopularMovies as jest.Mock).mockResolvedValue([]);
//     (movieApi.getTopRatedMovies as jest.Mock).mockResolvedValue([]);
//     (movieApi.getUpcomingMovies as jest.Mock).mockResolvedValue([]);
//     (movieApi.getGenres as jest.Mock).mockResolvedValue([
//       { id: 1, name: 'Action' },
//       { id: 2, name: 'Comedy' },
//     ]);
//     (movieApi.getKeywords as jest.Mock).mockResolvedValue([]);
//     (movieApi.discoverMovies as jest.Mock).mockResolvedValue([]);
//   });

//   it('renders and calls APIs on load', async () => {
//     render(<Hero />);

//     await waitFor(() => {
//       expect(movieApi.getTrendingMovies).toHaveBeenCalled();
//       expect(movieApi.getPopularMovies).toHaveBeenCalled();
//       expect(movieApi.getTopRatedMovies).toHaveBeenCalled();
//       expect(movieApi.getUpcomingMovies).toHaveBeenCalled();
//       expect(movieApi.getGenres).toHaveBeenCalled();
//     });

//     expect(await screen.findByText(/Kamovie/i)).toBeInTheDocument();
//   });

//   it('toggles filters panel', async () => {
//     render(<Hero />);
//     await waitFor(() => expect(movieApi.getTrendingMovies).toHaveBeenCalled());

//     const filterBtn = screen.getByText(/Advanced Filters/i);
//     fireEvent.click(filterBtn);

//     expect(await screen.findByText(/Genre/i)).toBeInTheDocument();

//     // Click outside to close
//     fireEvent.mouseDown(document.body);
//     await waitFor(() => {
//       expect(screen.queryByText(/Genre/i)).not.toBeInTheDocument();
//     });
//   });

//   it('changes genre filter', async () => {
//     render(<Hero />);
//     await waitFor(() => expect(movieApi.getTrendingMovies).toHaveBeenCalled());

//     fireEvent.click(screen.getByText(/Advanced Filters/i));
//     const genreSelect = await screen.findByLabelText(/Genre/i);

//     fireEvent.change(genreSelect, { target: { value: '1' } });
//     expect((genreSelect as HTMLSelectElement).value).toBe('1');
//   });

//   it('clears all filters', async () => {
//     render(<Hero />);
//     await waitFor(() => expect(movieApi.getTrendingMovies).toHaveBeenCalled());

//     fireEvent.click(screen.getByText(/Advanced Filters/i));
//     const genreSelect = await screen.findByLabelText(/Genre/i);

//     fireEvent.change(genreSelect, { target: { value: '1' } });

//     const clearBtn = screen.getByText(/Clear all filters/i);
//     fireEvent.click(clearBtn);

//     expect((genreSelect as HTMLSelectElement).value).toBe('');
//   });

//   it('clicking trending genre chip triggers search', async () => {
//     render(<Hero />);
//     await waitFor(() => expect(movieApi.getTrendingMovies).toHaveBeenCalled());

//     const chip = await screen.findByText(/Action/i);
//     fireEvent.click(chip);

//     await waitFor(() => {
//       expect(movieApi.discoverMovies).toHaveBeenCalledWith(
//         expect.objectContaining({ query: 'Action' })
//       );
//     });
//   });

//   it('search input triggers discoverMovies on Enter', async () => {
//     render(<Hero />);
//     await waitFor(() => expect(movieApi.getTrendingMovies).toHaveBeenCalled());

//     const input = screen.getByPlaceholderText(/Search for movies/i);
//     fireEvent.change(input, { target: { value: 'Inception' } });
//     fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });

//     await waitFor(() => {
//       expect(movieApi.discoverMovies).toHaveBeenCalledWith(
//         expect.objectContaining({ query: 'Inception' })
//       );
//     });
//   });
// });
