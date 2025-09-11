// // Hero.test.tsx
// import { render, screen, waitFor } from "@testing-library/react";
// import userEvent from "@testing-library/user-event";
// import * as movieApi from "@/lib/movieApi";
// import Hero from "@/components/hero/Hero";

// jest.mock("@/lib/movieApi");

// const mockMovies = [
//   { id: 1, title: "Movie A", genre_ids: [1], release_date: "2022-01-01" },
//   { id: 2, title: "Movie B", genre_ids: [2], release_date: "2021-05-05" },
// ];

// const mockGenres = [
//   { id: 1, name: "Action" },
//   { id: 2, name: "Comedy" },
// ];

// describe("Hero Filters", () => {
//   beforeEach(() => {
//     (movieApi.getTrendingMovies as jest.Mock).mockResolvedValue(mockMovies);
//     (movieApi.getPopularMovies as jest.Mock).mockResolvedValue(mockMovies);
//     (movieApi.getTopRatedMovies as jest.Mock).mockResolvedValue(mockMovies);
//     (movieApi.getUpcomingMovies as jest.Mock).mockResolvedValue(mockMovies);
//     (movieApi.getGenres as jest.Mock).mockResolvedValue(mockGenres);
//     (movieApi.getKeywords as jest.Mock).mockResolvedValue([]);
//     (movieApi.discoverMovies as jest.Mock).mockResolvedValue(mockMovies);
//   });

//   it("opens and closes the filters panel", async () => {
//     render(<Hero />);
//     const filterBtn = await screen.findByText(/Advanced Filters/i);
    
//     // Open filters
//     await userEvent.click(filterBtn);
//     expect(await screen.findByLabelText(/Genre/i)).toBeInTheDocument();

//     // Close filters (click outside)
//     await userEvent.click(document.body);
//     await waitFor(() => {
//       expect(screen.queryByLabelText(/Genre/i)).not.toBeInTheDocument();
//     });
//   });

//   it("changes all filters", async () => {
//     render(<Hero />);
//     await userEvent.click(await screen.findByText(/Advanced Filters/i));

//     // Genre
//     const genreSelect = screen.getByLabelText(/Genre/i) as HTMLSelectElement;
//     await userEvent.selectOptions(genreSelect, "1");
//     expect(genreSelect.value).toBe("1");

//     // Year
//     const yearSelect = screen.getByLabelText(/Year/i) as HTMLSelectElement;
//     await userEvent.selectOptions(yearSelect, "2022");
//     expect(yearSelect.value).toBe("2022");

//     // Rating
//     const ratingSelect = screen.getByLabelText(/Min Rating/i) as HTMLSelectElement;
//     await userEvent.selectOptions(ratingSelect, "9");
//     expect(ratingSelect.value).toBe("9");

//     // Duration
//     const durationSelect = screen.getByLabelText(/Duration/i) as HTMLSelectElement;
//     await userEvent.selectOptions(durationSelect, "short");
//     expect(durationSelect.value).toBe("short");

//     // Sort By
//     const sortSelect = screen.getByLabelText(/Sort By/i) as HTMLSelectElement;
//     await userEvent.selectOptions(sortSelect, "vote_average.desc");
//     expect(sortSelect.value).toBe("vote_average.desc");
//   });

//   it("clears all filters", async () => {
//     render(<Hero />);
//     await userEvent.click(await screen.findByText(/Advanced Filters/i));

//     const genreSelect = screen.getByLabelText(/Genre/i) as HTMLSelectElement;
//     await userEvent.selectOptions(genreSelect, "1");

//     const clearBtn = screen.getByText(/Clear all filters/i);
//     await userEvent.click(clearBtn);

//     expect(genreSelect.value).toBe("");
//   });
// });
