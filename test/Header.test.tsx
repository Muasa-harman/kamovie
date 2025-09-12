import Header from "@/components/header/Header";
import { render, screen } from "@testing-library/react";

describe("Header", () => {
  it("renders the Call link with correct href", () => {
    render(<Header />);
    const callLink = screen.getByRole("link", { name: /call/i });
    expect(callLink).toHaveAttribute("href", "tel:+254721456992");
  });

  it("renders the WhatsApp link with correct href", () => {
    render(<Header />);
    const whatsappLink = screen.getByRole("link", { name: /whatsapp/i });
    expect(whatsappLink).toHaveAttribute(
      "href",
      "https://wa.me/254721456992"
    );
    expect(whatsappLink).toHaveAttribute("target", "_blank");
    expect(whatsappLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders the phone number text", () => {
    render(<Header />);
    expect(
      screen.getByText(/\+254721456992 for enquiries/i)
    ).toBeInTheDocument();
  });
});
