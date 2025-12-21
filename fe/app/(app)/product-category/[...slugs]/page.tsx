'use client';

import React, { useState, useEffect, use } from 'react';
import { Card, Button, Spin, Empty } from 'antd';
import { LoadingOutlined, ShoppingOutlined, HomeOutlined } from '@ant-design/icons';
import Link from 'next/link';
import type { Product } from '@/app/lib/product-api';
import type { Category } from '@/app/lib/category-api';
import { getPublicProductsByCategorySlug } from '@/app/lib/product-api';
import { getPublicCategoryBySlug } from '@/app/lib/category-api';

interface CategoryPageProps {
  params: Promise<{
    slugs: string[];
  }>;
}

const CategoryPage: React.FC<CategoryPageProps> = ({ params }) => {
  const { slugs } = use(params);
  // Use the last slug as the category to fetch
  const categorySlug = slugs[slugs.length - 1];
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000';
  
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [productsData, categoryData] = await Promise.all([
          getPublicProductsByCategorySlug(categorySlug),
          getPublicCategoryBySlug(categorySlug),
        ]);
        setProducts(productsData);
        setCategory(categoryData);
      } catch (error) {
        console.error('Failed to load category:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, [categorySlug]);

  const getImageUrl = (product: Product): string => {
    if (product.productImages && product.productImages.length > 0) {
      const url = product.productImages[0].url;
      return url.startsWith('http') ? url : `${apiBase}${url}`;
    }
    return '/images/product.jpg';
  };

  // Build breadcrumb items
  const breadcrumbItems = [
    {
      title: (
        <Link href="/">
          <HomeOutlined />
        </Link>
      ),
    },
    ...slugs.map((slug, index) => {
      const path = `/product-category/${slugs.slice(0, index + 1).join('/')}`;
      const isLast = index === slugs.length - 1;
      
      return {
        title: isLast ? (
          <span className="capitalize">{slug.replace(/-/g, ' ')}</span>
        ) : (
          <Link href={path} className="capitalize">
            {slug.replace(/-/g, ' ')}
          </Link>
        ),
      };
    }),
  ];

  return (
    <div className="bg-white py-20">
      <div className="container mx-auto max-w-screen-xl px-8 sm:px-12 lg:px-16">
        <div className="text-center mb-12">
          {loading ? (
            <div className="py-20">
              <Spin indicator={<LoadingOutlined style={{ fontSize: 48, color: '#2d6a2e' }} />} />
            </div>
          ) : (
            <>
          <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4 decoration-2 underline-offset-4">
                {category?.name || 'Category'}
              </h2>
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
                <div className="bg-white flex flex-col items-center hover:translate-y-[-8px] transition-all duration-300">
                  {/* Image with border */}
                  <div className="w-full border-4 border-[#2d5016] ">
                    <img
                      alt={product.name}
                      src={getImageUrl(product)}
                      className="aspect-square object-cover w-full"
                    />
                  </div>
                  
                  {/* Product Name */}
                  <h3 className="text-lg font-bold text-[#2d5016] mt-6 text-center px-4 line-clamp-2 min-h-[3.5rem]">
                    {product.name}
                  </h3>
                  
                  {/* Button */}
                  <div className="w-full px-4 pb-6">
                    <button className="w-full bg-[#e8e8e8] text-[#515151] font-semibold py-3  uppercase text-sm tracking-wider hover:bg-[#2d5016] hover:text-white transition-colors duration-300 rounded-md">READ MORE</button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : !loading && products.length === 0 ? (
          <Empty
            description={
              <span className="text-lg">
                No products found in this category
              </span>
            }
            style={{ marginTop: '60px', marginBottom: '60px' }}
          >
            <Link href="/">
              <Button type="primary" size="large" className="bg-[#2d5016] hover:bg-[#3d7a3e]">
                Back to Home
              </Button>
            </Link>
          </Empty>
        ) : null}
      </div>
    </div>
  );
};

export default CategoryPage;
