import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Filter from "./Filter";
import { useRouter, useSearchParams } from "next/navigation";
import { Color, Size } from "@/types";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

const mockPush = jest.fn();
(useRouter as jest.Mock).mockReturnValue({ push: mockPush });
(useSearchParams as jest.Mock).mockReturnValue({
  get: jest.fn().mockReturnValue(null),
  toString: jest.fn().mockReturnValue(""),
});

jest.mock("query-string", () => ({
  parse: jest.fn(() => ({})),
  stringifyUrl: jest.fn(
    ({ url, query }) => `${url}?${new URLSearchParams(query).toString()}`
  ),
}));

describe("Filter", () => {
  const mockData: (Size | Color)[] = [
    { id: "1", name: "Red", value: "red" },
    { id: "2", name: "Blue", value: "blue" },
  ];

  it("renders correctly", () => {
    const { getByText } = render(
      <Filter valueKey="color" name="Color" data={mockData} />
    );

    expect(getByText("Color")).toBeInTheDocument();
    expect(getByText("Red")).toBeInTheDocument();
    expect(getByText("Blue")).toBeInTheDocument();
  });

  it("calls router.push with correct URL when a filter is clicked", () => {
    const { getByText } = render(
      <Filter valueKey="color" name="Color" data={mockData} />
    );

    mockPush.mockClear();
    fireEvent.click(getByText("Red"));
    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining("color=1"));

    fireEvent.click(getByText("Blue"));
    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining("color=2"));
  });

  it("removes filter when the same filter is clicked again", () => {
    const mockGet = jest.fn();
    const mockToString = jest.fn();

    (useSearchParams as jest.Mock).mockReturnValue({
      get: mockGet,
      toString: mockToString,
    });

    mockGet.mockReturnValue("1");
    mockToString.mockReturnValue("color=1");

    const { getByText } = render(
      <Filter valueKey="color" name="Color" data={mockData} />
    );

    fireEvent.click(getByText("Red"));

    mockGet.mockReturnValue(null);
    mockToString.mockReturnValue("");

    expect(mockPush).toHaveBeenCalledWith("http://localhost/?color=1");
  });

  it("applies selected styles to the selected filter", () => {
    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue("1"),
      toString: jest.fn().mockReturnValue("color=1"),
    });

    const { getByText } = render(
      <Filter valueKey="color" name="Color" data={mockData} />
    );

    expect(getByText("Red")).toHaveClass("bg-gray-800 text-white");
    expect(getByText("Blue")).not.toHaveClass("bg-gray-800 text-white");
  });
});
