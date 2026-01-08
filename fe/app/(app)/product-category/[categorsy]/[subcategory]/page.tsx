"use client";

import React, { useState, useEffect, use } from "react";
import { Card, Button, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/app/lib/product-api";
import type { Category } from "@/app/lib/category-api";
import { getPublicProductsByCategorySlug } from "@/app/lib/product-api";
import { getPublicCategoryBySlug } from "@/app/lib/category-api";

interface ProductCategoryPageProps {
  params: Promise<{
    categorsy: string;
    subcategory: string;
  }>;
}

const ProductCategoryPage: React.FC<ProductCategoryPageProps> = ({
  params,
}) => {
  const { categorsy, subcategory } = use(params);
  const apiBase =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [productsData, categoryData] = await Promise.all([
          getPublicProductsByCategorySlug(subcategory),
          getPublicCategoryBySlug(subcategory),
        ]);
        setProducts(productsData);
        setCategory(categoryData);
      } catch (error) {
        console.error("Failed to load category:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [subcategory]);

  const getProductImageUrl = (product: Product): string => {
    if (product.productImages && product.productImages.length > 0) {
      const url = product.productImages[0].url;
      return url.startsWith("http") ? url : `${apiBase}${url}`;
    }
    return "/images/product.jpg";
  };

  return (
    <div className="bg-white py-20">
      <div className="container mx-auto max-w-screen-xl px-8 sm:px-12 lg:px-16">
        <div className="text-center mb-12">
          {loading ? (
            <div className="py-20">
              <Spin
                indicator={
                  <LoadingOutlined style={{ fontSize: 48, color: "#2d6a2e" }} />
                }
              />
            </div>
          ) : (
            <>
              <h1 className="text-5xl font-bold text-[#2d5016] mb-3">
                {category?.name || "Category"}
              </h1>
              {category?.description && (
                <p className="text-lg text-gray-600">{category.description}</p>
              )}
            </>
          )}
        </div>

        {!loading && products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {products.map((product) => (
              <Link href={`/product/${product.id}`} key={product.id}>
                <div className="flex flex-col items-center">
                  <Card
                    hoverable
                    className="w-full border-none shadow-none bg-transparent hover:translate-y-[-8px] transition-all duration-300"
                    cover={
                      <div className="w-full h-full border-none shadow-none flex items-center justify-center bg-white p-5">
                        <Image
                          alt={product.name}
                          src={getProductImageUrl(product)}
                          width={300}
                          height={300}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.currentTarget.src =
                              "/images/placeholder-product.jpg";
                          }}
                        />
                      </div>
                    }
                  >
                    <Card.Meta
                      title={
                        <h3 className="text-xl font-semibold text-[#2d5016] my-5 text-center">
                          {product.name}
                        </h3>
                      }
                      description={
                        <div className="flex flex-col items-center">
                          <Button
                            type="primary"
                            block
                            className="bg-[#e8e8e8] text-[#4a4a4a] border-none font-semibold h-[45px] rounded-none text-sm tracking-wide uppercase hover:bg-[#2d5016] hover:text-white"
                          >
                            READ MORE
                          </Button>
                        </div>
                      }
                    />
                  </Card>
                </div>
              </Link>
            ))}
          </div>
        ) : !loading && products.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-3xl text-gray-900 mb-3">
              No Products Available
            </h3>
            <p className="text-base text-gray-600 mb-8">
              Products for this category are coming soon.
            </p>
            <Link href="/">
              <Button
                type="primary"
                size="large"
                className="bg-[#2d5016] hover:bg-[#3d7a3e]"
              >
                Back to Home
              </Button>
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ProductCategoryPage;
