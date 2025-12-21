'use client';

import React, { useEffect, useState } from 'react';
import { ClockCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

interface PreviewData {
  title: string;
  contentHtml: string;
  primaryImage: string;
  publishedAt: string;
}

export default function PreviewPage() {
  const [data, setData] = useState<PreviewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get preview data from sessionStorage
    const preview = sessionStorage.getItem('articlePreview');
    if (preview) {
      setData(JSON.parse(preview));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">No preview data available</p>
      </div>
    );
  }

  const dateText = dayjs(data.publishedAt).format('DD MMMM YYYY');

  return (
    <div className="bg-white min-h-screen py-20">
      <div className="container mx-auto max-w-screen-xl px-8 sm:px-12 lg:px-16">
        <article className="bg-white">
          {data.primaryImage && (
            <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
              <img
                src={data.primaryImage}
                alt={data.title}
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          <header className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#2d5016] mb-4 leading-tight">
              {data.title}
            </h1>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <ClockCircleOutlined />
              <time>{dateText}</time>
            </div>
          </header>

          <div
            className="prose prose-lg max-w-none
              [&_p]:text-gray-700 [&_p]:leading-relaxed [&_p]:text-base [&_p]:break-words
              [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-[#2d5016] [&_h2]:mb-4 [&_h2]:mt-8 [&_h2]:break-words
              [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:text-[#2d5016] [&_h3]:mb-4 [&_h3]:mt-8 [&_h3]:break-words
              [&_ul]:list-disc [&_ul]:list-inside [&_ul]:mb-6 [&_ul]:space-y-2
              [&_li]:text-gray-700 [&_li]:break-words
              [&_a]:text-[#2d5016] [&_a]:underline [&_a]:break-all
              [&_figure]:mb-8 [&_figure]:mt-8
              [&_img]:w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:shadow-md
              break-words overflow-wrap-anywhere"
            dangerouslySetInnerHTML={{ __html: data.contentHtml }}
          />
        </article>
      </div>
    </div>
  );
}
