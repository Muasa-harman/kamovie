import { render, screen, fireEvent } from '@testing-library/react';
import * as movieApi from '@/lib/movieApi';
import Hero from '@/components/hero/Hero';

jest.mock('@/lib/movieApi');

describe('Hero Trailer Button', () => {
  beforeEach(() => {
    (movieApi.getTrendingMovies as jest.Mock).mockResolvedValue([]);
    (movieApi.getGenres as jest.Mock).mockResolvedValue([]);
  });

  it('opens trailer modal when Watch Trailer button is clicked', async () => {
    render(<Hero />);

    // Assuming your Hero renders the Button with "▶ Watch Trailer"
    const trailerBtn = screen.getByRole('button', { name: /▶ Watch Trailer/i });
    fireEvent.click(trailerBtn);

    // Check that the trailer state is open (if you render a modal or text)
    expect(screen.getByText(/trailer/i)).toBeInTheDocument(); // Adjust text depending on your modal
  });
});
