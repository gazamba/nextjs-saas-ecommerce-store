import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import CartItem from "./CartItem";
import { Product } from "@/types";
import useCart from "@/hooks/useCart";

jest.mock("@/hooks/useCart", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockRemoveItem = jest.fn();

beforeEach(() => {
  (useCart as unknown as jest.Mock).mockReturnValue({
    removeItem: mockRemoveItem,
  });
});

const product: Product = {
  id: "1",
  name: "Test Product",
  price: 100,
  images: [
    {
      url: "/test-image.jpg",
      id: "",
    },
  ],
  color: {
    name: "Red",
    id: "",
    value: "",
  },
  size: {
    name: "M",
    id: "",
    value: "",
  },
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
};

test("renders CartItem component", () => {
  render(<CartItem data={product} />);

  expect(screen.getByText("Test Product")).toBeInTheDocument();
  expect(screen.getByText("Red")).toBeInTheDocument();
  expect(screen.getByText("M")).toBeInTheDocument();
  expect(screen.getByText("$100.00")).toBeInTheDocument();
});

test("removes item from cart when remove button is clicked", () => {
  render(<CartItem data={product} />);

  const removeButton = screen.getByRole("button");
  fireEvent.click(removeButton);

  expect(mockRemoveItem).toHaveBeenCalledWith("1");
});
