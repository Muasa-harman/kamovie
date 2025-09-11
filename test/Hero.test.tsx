// components/Hero.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Hero from './Hero';
import * as movieApi from '@/lib/movieApi';

jest.mock('@/lib/movieApi');

describe('Hero Component', () => {
  const mockGenres = [
    { id: 1, name: 'Action' },
    { id: 2, name: 'Comedy' },
  ];

  const mockTrendingMovies = [
    { id: 101, title: 'Movie 1', genre_ids: [1], release_date: '2025-01-01' },
    { id: 102, title: 'Movie 2', genre_ids: [2], release_date: '2024-01-01' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (movieApi.getTrendingMovies as jest.Mock).mockResolvedValue(mockTrendingMovies);
    (movieApi.getPopularMovies as jest.Mock).mockResolvedValue([]);
    (movieApi.getTopRatedMovies as jest.Mock).mockResolvedValue([]);
    (movieApi.getUpcomingMovies as jest.Mock).mockResolvedValue([]);
    (movieApi.getGenres as jest.Mock).mockResolvedValue(mockGenres);
    (movieApi.getKeywords as jest.Mock).mockResolvedValue([
      { id: 1, name: 'Action' },
      { id: 2, name: 'Adventure' },
    ]);
    (movieApi.discoverMovies as jest.Mock).mockResolvedValue(mockTrendingMovies);
  });

  it('renders headline and description', async () => {
    render(<Hero />);
    expect(screen.getByText(/Discover Your Next/i)).toBeInTheDocument();
    expect(screen.getByText(/Get personalized movie recommendations/i)).toBeInTheDocument();
  });

  it('shows suggestions when typing in search box', async () => {
    render(<Hero />);
    const input = screen.getByPlaceholderText(/Search for movies/i);
    fireEvent.change(input, { target: { value: 'Act' } });

    await waitFor(() => {
      expect(screen.getByText('Action')).toBeInTheDocument();
      expect(screen.getByText('Adventure')).toBeInTheDocument();
    });
  });

  it('searches movies when pressing Enter or clicking search', async () => {
    render(<Hero />);
    const input = screen.getByPlaceholderText(/Search for movies/i);
    const button = screen.getByRole('button', { name: /Search/i });

    fireEvent.change(input, { target: { value: 'Action' } });
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });

    await waitFor(() => {
      expect(movieApi.discoverMovies).toHaveBeenCalledWith(expect.objectContaining({ query: 'Action' }));
    });

    fireEvent.click(button);
    await waitFor(() => {
      expect(movieApi.discoverMovies).toHaveBeenCalledTimes(2);
    });
  });

  it('opens trailer modal when Watch Trailer button is clicked', async () => {
    render(<Hero />);
    const trailerBtn = await screen.findByRole('button', { name: /▶ Watch Trailer/i });
    fireEvent.click(trailerBtn);

    // Replace with your modal text or element
    expect(screen.getByText(/trailer/i)).toBeInTheDocument();
  });

  it('toggles filters panel', async () => {
    render(<Hero />);
    const filterBtn = screen.getByText(/Advanced Filters/i);
    
    fireEvent.click(filterBtn);
    expect(await screen.findByText(/Genre/i)).toBeInTheDocument();

    fireEvent.click(document.body);
    expect(screen.queryByText(/Genre/i)).not.toBeInTheDocument();
  });

  it('changes and clears filters', async () => {
    render(<Hero />);
    fireEvent.click(screen.getByText(/Advanced Filters/i));

    const genreSelect = await screen.findByLabelText(/Genre/i);
    fireEvent.change(genreSelect, { target: { value: '1' } });
    expect((genreSelect as HTMLSelectElement).value).toBe('1');

    const clearBtn = screen.getByText(/Clear all filters/i);
    fireEvent.click(clearBtn);
    expect((genreSelect as HTMLSelectElement).value).toBe('');
  });
});
