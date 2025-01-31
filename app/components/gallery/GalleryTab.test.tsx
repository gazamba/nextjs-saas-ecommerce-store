import { render } from "@testing-library/react";
import GalleryTab from "./GalleryTab";
import { Tab, TabGroup } from "@headlessui/react";
import { Image as ImageType } from "@/types";

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  ),
}));

describe("GalleryTab", () => {
  it("renders the image correctly", () => {
    const image: ImageType = {
      url: "/test-image.jpg",
      id: "",
    };

    const { getByAltText } = render(
      <TabGroup>
        <Tab>
          <GalleryTab image={image} />
        </Tab>
      </TabGroup>
    );

    expect(getByAltText("")).toHaveAttribute("src", "/test-image.jpg");
  });
});
