'use client';

import React, { useEffect, useState } from 'react';
import { Button, Spin, Empty } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { getProducts, type Product } from '@/app/lib/product-api';
import Link from 'next/link';
import { useLanguage } from '@/app/providers/LanguageProvider';

export default function LatestSection() {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLatestProducts();
  }, []);

  const loadLatestProducts = async () => {
    try {
      // Get products without auth (public endpoint)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000'}/product`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const result = await response.json();
      const allProducts = result.data || result;
      
      // Convert relative URLs to absolute URLs
      const processedProducts = Array.isArray(allProducts)
        ? allProducts.map((product: Product) => ({
            ...product,
            productImages: product.productImages.map((img) => ({
              ...img,
              url: img.url.startsWith('http')
                ? img.url
                : `${process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000'}${img.url}`,
            })),
          }))
        : [];

      // Get latest 5 products
      setProducts(processedProducts.slice(0, 5));
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white py-20">
      <div className="container mx-auto max-w-screen-xl px-8 sm:px-12 lg:px-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-[#2d6a2e] mb-4">
            {t.home.latestTitle}
          </h2>
          <p className="text-lg text-gray-600">
            {t.home.latestSubtitle}
          </p>
        </div>

        <Spin 
          spinning={loading} 
          indicator={<LoadingOutlined style={{ fontSize: 48, color: '#2d6a2e' }} />}
        >
          {products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {products.map((product) => (
                <div key={product.id} className="flex flex-col h-full items-center justify-between">
                  <div className="bg-white border-3 border-[#2d6a2e] flex items-center justify-center aspect-square w-full overflow-hidden ">
                    {product.productImages && product.productImages.length > 0 ? (
                      <img 
                        src={product.productImages[0].url} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        {t.home.noImage}
                      </div>
                    )}
                  </div>
                  <h3 className="text-center text-sm font-bold text-[#2d6a2e] px-2 min-h-[4.5rem] flex items-center justify-center flex-grow">
                    {product.name}
                  </h3>
                    <div className="w-full flex justify-center">
                      <Link href={`/product/${product.id}`} className="w-full flex justify-center">
                      <Button 
                        type="primary"
                        className="!bg-[#2d6a2e] hover:!bg-[#3d8a3e] !border-none !rounded !h-10 font-semibold !px-6 mt-auto mx-auto block"
                      >
                        {t.home.latestReadMore}
                      </Button>
                      </Link>
                    </div>
                </div>
              ))}
            </div>
          ) : (
            <Empty 
              description="No products available" 
              style={{ marginTop: '60px', marginBottom: '60px' }}
            />
          )}
        </Spin>
      </div>
    </div>
  );
}
