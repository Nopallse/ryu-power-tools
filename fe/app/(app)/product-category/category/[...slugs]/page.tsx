'use client';

import React, { useState, useEffect, use } from 'react';
import { Card, Button, Spin, Empty, Breadcrumb } from 'antd';
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
        {/* Breadcrumb */}
        <div className="mb-8">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        <div className="text-center mb-12">
          {loading ? (
            <div className="py-20">
              <Spin indicator={<LoadingOutlined style={{ fontSize: 48, color: '#2d6a2e' }} />} />
            </div>
          ) : (
            <>
              <h1 className="text-5xl font-bold text-[#2d5016] mb-3">
                {category?.name || 'Category'}
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
                        <img
                          alt={product.name}
                          src={getImageUrl(product)}
                          width={300}
                          height={300}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = '/images/product.jpg';
                          }}
                        />
                      </div>
                    }
                  >
                    <Card.Meta
                      title={
                        <h3 className="text-xl font-semibold text-[#2d5016] my-5 text-center line-clamp-2 min-h-[3.5rem]">
                          {product.name}
                        </h3>
                      }
                      description={
                        <div className="flex flex-col items-center">
                          <Button
                            type="primary"
                            block
                            className="bg-[#e8e8e8] text-[#4a4a4a] border-none font-semibold h-[45px] rounded-none text-sm tracking-wide uppercase hover:bg-[#2d5016] hover:text-white"
                            icon={<ShoppingOutlined />}
                          >
                            VIEW DETAILS
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
