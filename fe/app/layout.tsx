import React from 'react';
import { Poppins, Anton } from 'next/font/google';
import type { Metadata } from 'next';
import { ConfigProvider, App as AntdApp } from 'antd';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import './globals.css';
import theme from './theme/themeConfig';
import ScrollToTop from '@/app/components/ScrollToTop';
import { LanguageProvider } from '@/app/providers/LanguageProvider';

export const metadata: Metadata = {
  other: {
    google: 'notranslate',
  },
};

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
});

const anton = Anton({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-anton',
});

const RootLayout = ({ children }: React.PropsWithChildren) => (
  <html lang="en" className={`${poppins.variable} ${anton.variable} notranslate`} translate="no" suppressHydrationWarning>
    <body className="notranslate" translate="no" suppressHydrationWarning>
      <AntdRegistry>
        <LanguageProvider>
          <ConfigProvider theme={theme}>
            <AntdApp>
              {children}
            </AntdApp>
          </ConfigProvider>
        </LanguageProvider>
      </AntdRegistry>
    </body>
  </html>
);

export default RootLayout;