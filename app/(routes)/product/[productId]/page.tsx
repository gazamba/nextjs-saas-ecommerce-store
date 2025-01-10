import getProduct from "@/actions/get-product";
import getProducts from "@/actions/get-products";
import Gallery from "@/app/components/gallery";
import ProductList from "@/app/components/ProductList";
import Container from "@/app/components/ui/Container";
import React from "react";

interface ProductPageProps {
  params: { productId: string };
}
const ProductPage = async ({ params }: ProductPageProps) => {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.productId);
  const suggestedProducts = await getProducts({
    categoryId: product?.category?.id,
  });

  console.log(suggestedProducts);

  return (
    <div className="bg-white">
      <Container>
        <div className="px-4 py-10 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
            <Gallery images={product.images} />
            <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">Info</div>
          </div>
          <hr className="my-10" />
          <ProductList title="Related Products" items={suggestedProducts} />
        </div>
      </Container>
    </div>
  );
};

export default ProductPage;
