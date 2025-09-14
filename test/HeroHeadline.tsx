import HeroHeadline from "@/components/hero/Hero.ts/HeroHeadline";
import { render, screen, act } from "@testing-library/react";


jest.useFakeTimers();

describe("HeroHeadline", () => {
  it("renders the first headline initially", () => {
    render(<HeroHeadline />);
    expect(
      screen.getByRole("heading", { name: /find movies you’ll actually love/i })
    ).toBeInTheDocument();
  });

  it("rotates to the next headline after interval", () => {
    render(<HeroHeadline />);
    act(() => {
      jest.advanceTimersByTime(4000);
    });
    expect(
      screen.getByRole("heading", { name: /your movie journey starts here/i })
    ).toBeInTheDocument();
  });

  it("highlights special keywords with .text-primary class", () => {
    render(<HeroHeadline />);
    const highlightedWords = screen
      .getAllByText(/movie|love|discover/i)
      .filter((el) => el.tagName.toLowerCase() === "span");

    highlightedWords.forEach((word) => {
      expect(word).toHaveClass("text-primary");
    });
  });
});
