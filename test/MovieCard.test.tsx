import MovieCard from '@/components/card/MovieCard';
import { render, screen } from '@testing-library/react';
// import MovieCard from './MovieCard';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('MovieCard', () => {
  const pushMock = jest.fn();
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
  });

  it('renders title and rating', () => {
    render(
      <MovieCard
        title="Inception"
        rating={8.7}
        poster="/inception.jpg"
        id={1}
      />
    );

    expect(screen.getByText('Inception')).toBeInTheDocument();
    expect(screen.getByText('8.7/10')).toBeInTheDocument();
  });

  it('navigates to movie page on click', () => {
    render(
      <MovieCard
        title="Inception"
        rating={8.7}
        poster="/inception.jpg"
        id={1}
      />
    );

    screen.getByText('Inception').closest('div')?.click();
    expect(pushMock).toHaveBeenCalledWith('/movies/1');
  });
});
