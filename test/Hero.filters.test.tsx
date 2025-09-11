// components/Hero.filters.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import * as movieApi from '@/lib/movieApi';
import Hero from '@/components/hero/Hero';

jest.mock('@/lib/movieApi');

describe('Hero Filters Dropdown', () => {
  beforeEach(() => {
    (movieApi.getTrendingMovies as jest.Mock).mockResolvedValue([]);
    (movieApi.getGenres as jest.Mock).mockResolvedValue([
      { id: 1, name: 'Action' },
      { id: 2, name: 'Comedy' },
    ]);
  });

  it('toggles filters panel', async () => {
    render(<Hero />);
    const filterBtn = screen.getByText(/Advanced Filters/i);
    
    // Open filters
    fireEvent.click(filterBtn);
    expect(await screen.findByText(/Genre/i)).toBeInTheDocument();

    // Close filters
    fireEvent.click(document.body);
    expect(screen.queryByText(/Genre/i)).not.toBeInTheDocument();
  });

  it('changes genre filter', async () => {
    render(<Hero />);
    fireEvent.click(screen.getByText(/Advanced Filters/i));
    
    const genreSelect = await screen.findByLabelText(/Genre/i);
    fireEvent.change(genreSelect, { target: { value: '1' } });
    
    expect((genreSelect as HTMLSelectElement).value).toBe('1');
  });

  it('clears all filters', async () => {
    render(<Hero />);
    fireEvent.click(screen.getByText(/Advanced Filters/i));
    
    const genreSelect = await screen.findByLabelText(/Genre/i);
    fireEvent.change(genreSelect, { target: { value: '1' } });
    
    const clearBtn = screen.getByText(/Clear all filters/i);
    fireEvent.click(clearBtn);

    expect((genreSelect as HTMLSelectElement).value).toBe('');
  });
});
