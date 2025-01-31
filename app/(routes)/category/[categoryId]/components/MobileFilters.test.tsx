import { render, fireEvent } from "@testing-library/react";
import MobileFilters from "./MobileFilters";
import { Color, Size } from "@/types";
import {
  JSX,
  ClassAttributes,
  ButtonHTMLAttributes,
  JSXElementConstructor,
  ReactElement,
  ReactNode,
  ReactPortal,
} from "react";

jest.mock(
  "@/app/components/ui/Button",
  () =>
    (
      props: JSX.IntrinsicAttributes &
        ClassAttributes<HTMLButtonElement> &
        ButtonHTMLAttributes<HTMLButtonElement>
    ) =>
      <button {...props}>{props.children}</button>
);

jest.mock(
  "@/app/components/ui/IconButton",
  () =>
    (
      props: JSX.IntrinsicAttributes &
        ClassAttributes<HTMLButtonElement> &
        ButtonHTMLAttributes<HTMLButtonElement>
    ) =>
      <button {...props}>{props.children}</button>
);

jest.mock(
  "./Filter",
  () =>
    (props: {
      name:
        | string
        | number
        | bigint
        | boolean
        | ReactElement<unknown, string | JSXElementConstructor<any>>
        | Iterable<ReactNode>
        | ReactPortal
        | Promise<
            | string
            | number
            | bigint
            | boolean
            | ReactPortal
            | ReactElement<unknown, string | JSXElementConstructor<any>>
            | Iterable<ReactNode>
            | null
            | undefined
          >
        | null
        | undefined;
    }) =>
      <div>{props.name}</div>
);

describe("MobileFilters", () => {
  const sizes: Size[] = [
    { id: "1", name: "Small", value: "small" },
    { id: "2", name: "Large", value: "large" },
  ];

  const colors: Color[] = [
    { id: "1", name: "Red", value: "red" },
    { id: "2", name: "Blue", value: "blue" },
  ];

  it("renders button to open filters", () => {
    const { getByText } = render(
      <MobileFilters sizes={sizes} colors={colors} />
    );
    expect(getByText("Filters")).toBeInTheDocument();
  });

  it("opens and closes the filter modal", () => {
    const { getByText, queryByText, getAllByRole } = render(
      <MobileFilters sizes={sizes} colors={colors} />
    );

    const openButton = getByText("Filters");
    fireEvent.click(openButton);

    expect(getByText("Size")).toBeInTheDocument();
    expect(getByText("Color")).toBeInTheDocument();

    const buttons = getAllByRole("button");
    const closeButton = buttons[buttons.length - 1]; // Last button

    fireEvent.click(closeButton);

    expect(queryByText("Size")).not.toBeInTheDocument();
    expect(queryByText("Color")).not.toBeInTheDocument();
  });
});
