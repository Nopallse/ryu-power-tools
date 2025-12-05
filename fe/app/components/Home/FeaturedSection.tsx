'use client';

import React from 'react';
import Link from 'next/link';

const categories = [
  {
    id: 1,
    image: '/images/feature_product.webp',
    title: 'Power Tools',
    description: 'High-performance tools for precision, built with power & ready for everyday challenges.',
    link: '/category/power-tools',
    label: 'POWER TOOLS'
  },
  {
    id: 2,
    image: '/images/feature_product.webp',
    title: 'Engine',
    description: 'Reliable engines designed to deliver quality performance at competitive prices.',
    link: '/category/engine',
    label: 'ENGINE'
  },
  {
    id: 3,
    image: '/images/feature_product.webp',
    title: 'Welding',
    description: 'Durable welding equipment trusted to meet the specific needs of customers.',
    link: '/category/welding',
    label: 'WELDING'
  },
  {
    id: 4,
    image: '/images/feature_product.webp',
    title: 'Accessories',
    description: 'Essential add-ons and spare parts for all your power tool needs.',
    link: '/category/accessories',
    label: 'ACCESSORIES'
  }
];

export default function FeaturedSection() {
  return (
    <div className="bg-white py-16 sm:py-20 lg:py-24 px-6 sm:px-8 md:px-10">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4 underline decoration-2 underline-offset-4">
            FEATURED PRODUCTS
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div key={category.id} className="flex flex-col h-full">
              <Link href={category.link}>
                <div className="relative bg-gradient-to-br from-gray-300 to-gray-400  mb-4 overflow-hidden cursor-pointer">
                  <img 
                    src={category.image} 
                    alt={category.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                 
                </div>
              </Link>
              <h3 className="text-xl font-bold text-[#1c244b] mb-3">
                {category.title}
              </h3>
              <p className="text-sm text-[#324A6D] leading-relaxed">
                {category.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
