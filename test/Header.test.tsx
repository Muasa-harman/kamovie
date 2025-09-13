import Header from "@/components/header/Header";
import { render, screen } from "@testing-library/react";

describe("Header", () => {
  it("renders the header text", () => {
    render(<Header />);
    expect(screen.getByText(/Welcome to Kamove/i)).toBeInTheDocument();
  });

  it("contains a Call link", () => {
    render(<Header />);
    const callLink = screen.getByRole("link", { name: /Call/i });
    expect(callLink).toHaveAttribute("href", "tel:+254721456992");
  });

  it("contains a WhatsApp link", () => {
    render(<Header />);
    const whatsappLink = screen.getByRole("link", { name: /WhatsApp/i });
    expect(whatsappLink).toHaveAttribute("href", "https://wa.me/254721456992");
  });
});
