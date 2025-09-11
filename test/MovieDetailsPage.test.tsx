import { render, screen, fireEvent } from "@testing-library/react";
import * as movieApi from "@/lib/movieApi";
import { useRouter, useParams } from "next/navigation";
import MovieDetailsPage from "@/app/movies/[id]/page";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}));

jest.mock("@/lib/movieApi");

describe("MovieDetailsPage", () => {
  const mockMovie = {
    id: 1,
    title: "Test Movie",
    overview: "Test overview",
    poster_path: "/test.jpg",
    vote_average: 8,
    release_date: "2025-09-11",
    genres: [{ id: 1, name: "Action" }],
    credits: {
      cast: [
        { id: 1, name: "Actor 1", character: "Hero", profile_path: "/actor1.jpg" },
      ],
      crew: [{ id: 2, name: "Director 1", job: "Director" }],
    },
    videos: {
      results: [
        { id: "1", type: "Trailer", site: "YouTube", key: "abc123", name: "Trailer 1" },
      ],
    },
  };

  beforeEach(() => {
    jest.resetAllMocks();
    (useParams as jest.Mock).mockReturnValue({ id: "1" });
    (useRouter as jest.Mock).mockReturnValue({ back: jest.fn() });
    (movieApi.getMovieDetails as jest.Mock).mockResolvedValue(mockMovie);
  });

  it("renders loading spinner initially", () => {
    (movieApi.getMovieDetails as jest.Mock).mockReturnValue(new Promise(() => {}));
    render(<MovieDetailsPage />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders movie details after API call", async () => {
    render(<MovieDetailsPage />);
    
    // Wait for title to appear
    expect(await screen.findByText(mockMovie.title)).toBeInTheDocument();
    expect(screen.getByText(mockMovie.overview)).toBeInTheDocument();
    expect(screen.getByText(/Action/i)).toBeInTheDocument();
    expect(screen.getByText(/Director 1/i)).toBeInTheDocument();
    expect(screen.getByText(/8\/10/)).toBeInTheDocument();
  });

  it("opens trailer modal when Watch Trailer button is clicked", async () => {
    render(<MovieDetailsPage />);
    
    const trailerButton = await screen.findByRole("button", { name: /Watch Trailer/i });
    fireEvent.click(trailerButton);

    const iframe = await screen.findByTitle("Movie Trailer");
    expect(iframe).toBeInTheDocument();
    expect((iframe as HTMLIFrameElement).src).toContain(mockMovie.videos.results[0].key);

    // Close button should hide the modal
    const closeBtn = screen.getByText("✕");
    fireEvent.click(closeBtn);
    expect(screen.queryByTitle("Movie Trailer")).not.toBeInTheDocument();
  });

  it("calls router.back when Back button is clicked", async () => {
    const mockBack = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ back: mockBack });

    render(<MovieDetailsPage />);
    const backButton = await screen.findByRole("button", { name: /Back/i });
    fireEvent.click(backButton);

    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it("renders 'Movie not found' if API returns null", async () => {
    (movieApi.getMovieDetails as jest.Mock).mockResolvedValue(null);
    render(<MovieDetailsPage />);
    expect(await screen.findByText(/Movie not found/i)).toBeInTheDocument();
  });
});
