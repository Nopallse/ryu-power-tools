import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://ryu.pariamankota.tech';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/log8i8n738/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
