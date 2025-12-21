'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ClockCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useLanguage } from '@/app/providers/LanguageProvider';
import type { Article } from '@/app/lib/article-api';
import { getPublicArticleById, getPublicArticles } from '@/app/lib/article-api';

export default function BlogDetailPage() {
  const { t } = useLanguage();
  const params = useParams();
  const id = params.id as string;
  const [article, setArticle] = useState<Article | null>(null);
  const [related, setRelated] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000';
  const getImageUrl = (imageUrl?: string): string => {
    if (!imageUrl) return '/images/article.jpg';
    if (imageUrl.startsWith('http')) return imageUrl;
    return `${apiBase}${imageUrl}`;
  };

  useEffect(() => {
    (async () => {
      try {
        const data = await getPublicArticleById(id);
        setArticle(data);
        // fetch related: other published articles excluding current
        const list = await getPublicArticles();
        const others = list.filter(a => `${a.id}` !== id).slice(0, 3);
        setRelated(others);
      } catch (e) {
        console.error('Failed to load article', e);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const dateText = useMemo(() => {
    if (!article) return '';
    const d = article.publishedAt || article.createdAt;
    return d ? dayjs(d).format('DD MMMM YYYY') : '';
  }, [article]);

  if (!loading && !article) {
    return (
      <div className="bg-white py-20">
        <div className="container mx-auto max-w-screen-xl px-8 sm:px-12 lg:px-16 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{t.blog.articleNotFound}</h1>
          <Link href="/blog" className="text-[#2d5016] hover:underline">
            {t.blog.backToBlog}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white py-20">
      <div className="container mx-auto max-w-screen-xl px-8 sm:px-12 lg:px-16">
        {article && (
          <article className="bg-white">
            <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
              <img
                src={getImageUrl(article.primaryImage)}
                alt={article.title}
                className="w-full h-auto object-cover"
              />
            </div>

            <header className="mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-[#2d5016] mb-4 leading-tight">
                {article.title}
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
              dangerouslySetInnerHTML={{ __html: article.contentHtml }}
            />
          </article>
        )}

        {related.length > 0 && (
          <section className="mt-16 pt-8 border-t border-gray-200">
            <h3 className="text-2xl font-bold text-[#2d5016] mb-6">{t.blog.relatedArticles}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((r) => (
                <Link href={`/blog/${r.id}`} key={r.id}>
                  <div className="flex flex-col h-full group cursor-pointer bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                    <div className="overflow-hidden">
                      <img
                        src={getImageUrl(r.primaryImage)}
                        alt={r.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <h4 className="text-sm font-semibold text-gray-800 mb-4 line-clamp-3 leading-tight group-hover:text-[#2d5016] transition-colors text-center">
                        {r.title}
                      </h4>
                      <div className="border-t border-gray-300 -mx-6 mt-auto pt-4 px-6">
                        <p className="text-xs text-gray-400 text-center">
                          {dayjs(r.publishedAt || r.createdAt).format('DD MMMM YYYY')}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
