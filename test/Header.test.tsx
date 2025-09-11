import Header from '@/components/header/Header';
import { render, screen } from '@testing-library/react';

describe('Header', () => {
  it('renders the header text', () => {
    render(<Header />);
    expect(screen.getByText(/Welcome to Kamove/i)).toBeInTheDocument();
  });

  it('contains a link', () => {
    render(<Header />);
    const link = screen.getByRole('link', { name: /Call or whatsapp/i });
    expect(link).toHaveAttribute('href', 'tel:+254721456992');
  });
});
