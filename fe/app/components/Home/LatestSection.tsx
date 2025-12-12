'use client';

import React from 'react';
import { Button } from 'antd';

const products = [
  {
    id: 1,
    image: '/images/product.png',
    title: 'ROUTER RRT12-1',
    alt: 'Router RRT12-1'
  },
  {
    id: 2,
    image: '/images/product.png',
    title: 'CORDLESS WINDOW CLEANER 3.6 V RCW3.6',
    alt: 'Cordless Window Cleaner'
  },
  {
    id: 3,
    image: '/images/product.png',
    title: 'CORDLESS GLUE GUN 7 MM RCG7',
    alt: 'Cordless Glue Gun'
  },
  {
    id: 4,
    image: '/images/product.png',
    title: 'CORDLESS IMPACT DRILL 20V RCI20V',
    alt: 'Cordless Impact Drill'
  },
  {
    id: 5,
    image: '/images/product.png',
    title: 'CORDLESS DRILL 12V-1 RCD12V-1',
    alt: 'Cordless Drill 12V'
  }
];

export default function LatestSection() {
  return (
    <div className="bg-white py-20">
      <div className="container mx-auto max-w-screen-xl px-8 sm:px-12 lg:px-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-[#2d6a2e] mb-4">
            THE LATEST
          </h2>
          <p className="text-lg text-gray-600">
            Latest products
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {products.map((product) => (
            <div key={product.id} className="flex flex-col h-full items-center justify-between">
              <div className="bg-white border-2 border-[#2d6a2e] p-4 mb-4 flex items-center justify-center aspect-square w-full">
                <img 
                  src={product.image} 
                  alt={product.alt}
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-center text-sm font-bold text-[#2d6a2e] mb-4 px-2 min-h-[4.5rem] flex items-center justify-center flex-grow">
                {product.title}
              </h3>
              <Button 
                type="primary"
                className="!bg-[#2d6a2e] hover:!bg-[#3d8a3e] !border-none !rounded !h-10 font-semibold !px-6 mt-auto"
              >
                READ MORE
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
