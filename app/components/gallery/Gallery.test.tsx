import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Gallery from "./Gallery";
import { Image as ImageType } from "@/types";

const images: ImageType[] = [
  { id: "1", url: "/image1.jpg" },
  { id: "2", url: "/image2.jpg" },
  { id: "3", url: "/image3.jpg" },
  { id: "4", url: "/image4.jpg" },
];

describe("Gallery", () => {
  it("renders the Gallery component", () => {
    render(<Gallery images={images} />);

    images.forEach(() => {
      expect(screen.getByAltText("Image")).toBeInTheDocument();
    });

    const tabs = screen.getAllByRole("tab");
    tabs.forEach((tab, index) => {
      fireEvent.click(tab);
      const tabPanels = screen.getAllByRole("tabpanel");
      expect(tabPanels).toHaveLength(1);
      const img = screen.getByAltText("Image");
      expect(img).toBeInTheDocument();
      expect(img.getAttribute("src")).toContain(images[index].url.substring(1));
    });
  });
});
