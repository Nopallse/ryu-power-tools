'use client';

import React from 'react';
import Link from 'next/link';

const articles = [
  {
    id: 1,
    image: '/images/article.jpg',
    title: 'Power Tools Andal untuk Pekerjaan dan Kebutuhan Sehari-hari – RYU',
    date: '22 October 2025'
  },
  {
    id: 2,
    image: '/images/article.jpg',
    title: 'RYU Power Tools: Solusi Andal & Terjangkau untuk Konstruksi, Bengkel, dan DIY',
    date: '25 September 2025'
  },
  {
    id: 3,
    image: '/images/article.jpg',
    title: 'Gathering dan Seminar Welding RYU Power Tools',
    date: '4 September 2025'
  },
  {
    id: 4,
    image: '/images/article.jpg',
    title: 'Hadir di GIIAS 2024, Ryu Powertools Deretan Perkakas Otomotif Terbaiknya',
    date: '23 July 2024'
  }
];

export default function NewsArticleSection() {
  return (
    <div className="bg-white py-20">
      <div className="container mx-auto max-w-screen-xl px-8 sm:px-12 lg:px-16">
        {/* NEWS & ARTICLE */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-xl lg:text-2xl font-bold text-primary underline decoration-2 underline-offset-4">
              NEWS & ARTICLE
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {articles.map((article) => (
              <Link href={`/blog/${article.id}`} key={article.id}>
                <div className="flex flex-col h-full group cursor-pointer bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                  <div className="overflow-hidden">
                    <img 
                      src={article.image} 
                      alt={article.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-sm font-semibold text-gray-800 mb-4 line-clamp-3 leading-tight group-hover:text-primary transition-colors text-center">
                      {article.title}
                    </h3>
                    <div className="border-t border-gray-300 -mx-6 mt-auto pt-4 px-6">
                      <p className="text-xs text-gray-400 text-center">
                        {article.date}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          
        </div>
        <div className="text-center mb-16">
            <h2 className="text-lg lg:text-xl font-bold text-primary underline decoration-2 underline-offset-4">
              BLOGS
            </h2>
          </div>

        
      </div>
    </div>
  );
}
