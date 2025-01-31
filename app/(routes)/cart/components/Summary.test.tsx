import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import Summary from "./Summary";
import useCart from "@/hooks/useCart";
import { Product } from "@/types";

jest.mock("axios");
jest.mock("next/navigation", () => ({
  useSearchParams: jest.fn(),
}));
jest.mock("react-hot-toast", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));
jest.mock("@/hooks/useCart", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockItems: Product[] = [
  {
    id: "1",
    name: "Test Product",
    price: 100,
    images: [{ url: "/test-image.jpg", id: "" }],
    color: { name: "Red", id: "", value: "" },
    size: { name: "M", id: "", value: "" },
    category: {
      id: "1",
      name: "Test Category",
      billboard: {
        id: "1",
        label: "Test Billboard",
        imageUrl: "/test-image.jpg",
      },
    },
    isFeatured: false,
  },
  {
    id: "2",
    name: "Sample Product",
    price: 150,
    images: [{ url: "/sample-image.jpg", id: "img-2" }],
    color: { name: "Blue", id: "color-2", value: "#0000FF" },
    size: { name: "L", id: "size-2", value: "large" },
    category: {
      id: "2",
      name: "Sample Category",
      billboard: {
        id: "2",
        label: "Sample Billboard",
        imageUrl: "/sample-image.jpg",
      },
    },
    isFeatured: true,
  },
];

describe("Summary", () => {
  const mockState = {
    items: mockItems,
    removeAll: jest.fn(),
  };

  beforeEach(() => {
    (useCart as unknown as jest.Mock).mockImplementation((selector) =>
      selector(mockState)
    );
    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue(null),
    });
  });

  it("renders order total correctly", () => {
    render(<Summary />);
    expect(screen.getByText("Order total")).toBeInTheDocument();
    expect(screen.getByText("$250.00")).toBeInTheDocument();
  });

  it("displays success toast and removes all items on successful payment", () => {
    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue("success"),
    });

    render(<Summary />);
    expect(toast.success).toHaveBeenCalledWith("Payment completed.");
    expect(mockState.removeAll).toHaveBeenCalled();
  });

  it("displays error toast on canceled payment", () => {
    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue("canceled"),
    });

    render(<Summary />);
    expect(toast.error).toHaveBeenCalledWith("Something went wrong.");
  });

  it("calls onCheckout when checkout button is clicked", async () => {
    const response = { data: { url: "http://example.com" } };
    (axios.post as jest.Mock).mockResolvedValue(response);

    const originalLocation = window.location;
    let href = "";
    Object.defineProperty(window, "location", {
      get() {
        return { href };
      },
      set(newHref: string) {
        href = newHref;
      },
      configurable: true,
    });

    render(<Summary />);
    const checkoutButton = screen.getByText("Checkout");
    fireEvent.click(checkoutButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        `${process.env.NEXT_PUBLIC_API_URL}/checkout`,
        { productIds: mockItems.map((item) => item.id) }
      );
      expect(window.location.href).toBe(response.data.url);
    });

    Object.defineProperty(window, "location", originalLocation);
  });

  it("disables checkout button when there are no items", () => {
    (useCart as unknown as jest.Mock).mockImplementation((selector) =>
      selector({ ...mockState, items: [] })
    );

    render(<Summary />);
    const checkoutButton = screen.getByText("Checkout");
    expect(checkoutButton).toBeDisabled();
  });

  it("enables checkout button when there are items", () => {
    render(<Summary />);
    const checkoutButton = screen.getByText("Checkout");
    expect(checkoutButton).toBeEnabled();
  });
});
