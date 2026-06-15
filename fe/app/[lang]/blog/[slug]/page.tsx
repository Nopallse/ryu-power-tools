'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ClockCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useLanguage } from '@/app/providers/LanguageProvider';
import { useTranslatedData } from '@/app/hooks/useTranslatedData';
import type { Article } from '@/app/lib/article-api';
import { getPublicArticleBySlug, getPublicArticles } from '@/app/lib/article-api';
import { forceWrapHtml } from '@/app/lib/forceWrapHtml';

export default function BlogDetailPage() {
  const { t, language } = useLanguage();
  const params = useParams();
  const slug = params.slug as string;
  const [article, setArticle] = useState<Article | null>(null);
  const [related, setRelated] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

<<<<<<< HEAD:fe/app/[lang]/blog/[slug]/page.tsx
=======
  // Translate article (only title — HTML content is fragile to translate)
>>>>>>> 1e1a885d683c00eae1f8ae5e9dea81a034228306:fe/app/[lang]/blog/[id]/page.tsx
  const { translated: translatedArticle, isLoading: isTranslatingArticle } = useTranslatedData(
    article,
    language,
    ['title', 'excerpt']
  );

  const { translated: translatedRelated, isLoading: isTranslatingRelated } = useTranslatedData(
    related.length > 0 ? { items: related } : null,
    language,
    []
  );

  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000';
  const getImageUrl = (imageUrl?: string): string => {
    if (!imageUrl) return '/images/article.jpg';
    if (imageUrl.startsWith('http')) return imageUrl;
    return `${apiBase}${imageUrl}`;
  };

  useEffect(() => {
    (async () => {
      try {
        const data = await getPublicArticleBySlug(slug);
        setArticle(data);
        const list = await getPublicArticles();
        const others = list.filter((a) => a.slug !== slug).slice(0, 3);
        setRelated(others);
      } catch (e) {
        console.error('Failed to load article', e);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

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
          <Link href={`/${language}/blog`} className="text-[#2d5016] hover:underline">
            {t.blog.backToBlog}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white py-20">
      {article && (
        <article className="bg-white">
          <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
            <img
              src={getImageUrl(article.primaryImage)}
              alt={article.title}
              className="w-full h-auto object-cover"
            />
          </div>
          <div className="container mx-auto max-w-screen-xl px-8 sm:px-12 lg:px-16">
            <header className="mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-[#2d5016] mb-4 leading-tight">
                {isTranslatingArticle ? '...' : translatedArticle?.title || article?.title}
              </h1>
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <ClockCircleOutlined />
                <time>{dateText}</time>
              </div>
            </header>

            <div
              className="article-content prose prose-lg max-w-none
                [&_p]:text-gray-700 [&_p]:leading-relaxed [&_p]:text-base [&_p]:mb-6
                [&_span]:text-gray-700
                [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-[#2d5016] [&_h2]:mb-6 [&_h2]:mt-10
                [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-[#2d5016] [&_h3]:mb-6 [&_h3]:mt-8
                [&_ul]:list-disc [&_ul]:list-inside [&_ul]:mb-6 [&_ul]:space-y-2
                [&_li]:text-gray-700
                [&_a]:text-[#2d5016] [&_a]:underline
                [&_figure]:mb-10 [&_figure]:mt-10
                [&_img]:w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:shadow-md [&_img]:my-6
                [&_*]:max-w-full
                break-words"
<<<<<<< HEAD:fe/app/[lang]/blog/[slug]/page.tsx
              dangerouslySetInnerHTML={{ __html: (() => {
                const raw = article?.contentHtml || '';
                // convert relative src to absolute
                const withImages = raw.replace(/src=\"(\/[^\"]+)\"/g, (_m, p1) => `src="${getImageUrl(p1)}"`);
                return forceWrapHtml(withImages);
              })() }}
              style={{ whiteSpace: 'normal', overflowWrap: 'break-word', wordBreak: 'break-word', hyphens: 'auto' }}
=======
              dangerouslySetInnerHTML={{ __html: article?.contentHtml || '' }}
>>>>>>> 1e1a885d683c00eae1f8ae5e9dea81a034228306:fe/app/[lang]/blog/[id]/page.tsx
            />
          </div>
        </article>
      )}

      {(translatedRelated?.items || related).length > 0 && (
        <section className="mt-16 pt-8 border-t border-gray-200">
          <div className="container mx-auto max-w-screen-xl px-8 sm:px-12 lg:px-16">
            <h3 className="text-2xl font-bold text-[#2d5016] mb-6">{t.blog.relatedArticles}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(translatedRelated?.items || related).map((r: any) => (
                <Link href={`/${language}/blog/${r.slug}`} key={r.slug || r.id}>
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
                        {isTranslatingRelated ? '...' : r.title}
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
          </div>
        </section>
      )}
    </div>
  );
}