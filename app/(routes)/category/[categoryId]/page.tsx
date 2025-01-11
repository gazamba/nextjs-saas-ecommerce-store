import getCategory from "@/actions/get-category";
import getColors from "@/actions/get-colors";
import getProducts from "@/actions/get-products";
import getSizes from "@/actions/get-sizes";
import Billboard from "@/app/components/Billboard";
import Container from "@/app/components/ui/Container";
import React from "react";
import Filter from "./components/Filter";

export const revalidate = 0;

interface CategoryPageProps {
  params: { categoryId: string };
  searchParams: {
    colorId: string;
    sizeId: string;
  };
}
const CategoryPage = async ({ params, searchParams }: CategoryPageProps) => {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const products = await getProducts({
    categoryId: resolvedParams.categoryId,
    colorId: resolvedSearchParams.colorId,
    sizeId: resolvedSearchParams.sizeId,
  });
  const sizes = await getSizes();
  const colors = await getColors();
  const category = await getCategory(resolvedParams.categoryId);

  return (
    <div className="bg-white">
      <Container>
        <Billboard data={category.billboard} />
        <div className="px-4 sm:px-6 lg:px-8 pb-24">
          <div className="lg:grid lg:grid-cols-5 lg:gap-x-8">
            {/* Add mobile filters */}
            <div className="hidden lg:block">
              <Filter valueKey="sizeId" name="Size" data={sizes} />
              <Filter valueKey="colorId" name="Color" data={colors} />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default CategoryPage;
