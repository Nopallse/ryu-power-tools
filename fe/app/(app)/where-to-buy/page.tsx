import React from 'react';

type Marketplace = {
  name: string;
  url: string;
  logo?: string;
  textColor?: string;
  bgColor?: string;
};

const marketplaces: Marketplace[] = [
  {
    name: 'Tokopedia',
    url: 'https://www.tokopedia.com/ryuofficial',
    logo: '/images/icon/tokopedia.jpg',
  },
  {
    name: 'Shopee',
    url: 'https://shopee.co.id/ryuofficial',
    logo: '/images/icon/shopee.png',
  },
  {
    name: 'TikTok Shop',
    url: 'https://www.tiktok.com/shop/ryu-official-store-official',
    logo: '/images/icon/tiktok_shop.png',
  },
  {
    name: 'Lazada',
    url: 'https://www.lazada.co.id/',
    logo: '/images/icon/lazada.jpg',
  },
  {
    name: 'Monotaro',
    url: 'https://www.monotaro.id/shopbybrand/brand?brand=ryu',
    logo: '/images/icon/monotaro.jpg',
  },
  {
    name: 'Indoteknik',
    url: 'https://indoteknik.com/',
    logo: '/images/icon/indoteknik.webp',
  },
  {
    name: 'Fixcomart',
    url: 'https://fixcomart.com/',
    logo: '/images/icon/fixcomart.jpg',
  },
  {
    name: 'Blibli',
    url: 'https://www.blibli.com/',
    logo: '/images/icon/blibli.jpg',
  },
];

const WhereToBuyPage = () => {
  return (
    <div className="bg-white py-20">
      <div className="container mx-auto max-w-screen-xl px-8 sm:px-12 lg:px-16 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary underline mb-4">
          Marketplace &amp; E-commerce Official Store
        </h1>
        <p className="text-lg text-primary mb-12">We are available at</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-10 gap-y-12 justify-items-center">
          {marketplaces.map((item) => (
            <a
              key={item.name}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group w-full flex items-center justify-center"
            >
              <div
                className="w-full max-w-[230px] min-h-[96px] flex items-center justify-center rounded-xl bg-white  transition-transform duration-200 "
                style={{ backgroundColor: item.bgColor || 'white' }}
              >
                {item.logo ? (
                  <img
                    src={item.logo}
                    alt={`${item.name} logo`}
                    className="max-h-14 sm:max-h-16 w-auto object-contain"
                    loading="lazy"
                  />
                ) : (
                  <span
                    className="text-xl font-semibold"
                    style={{ color: item.textColor || '#2d5016' }}
                  >
                    {item.name}
                  </span>
                )}
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhereToBuyPage;
