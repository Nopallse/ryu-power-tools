import React from 'react';
import { Poppins, Anton } from 'next/font/google';
import { ConfigProvider } from 'antd';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import './globals.css';
import theme from './theme/themeConfig';
import LayoutWrapper from '@/app/components/LayoutWrapper';
import ScrollToTop from '@/app/components/ScrollToTop';

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
  <html lang="en" className={`${poppins.variable} ${anton.variable}`}>
    <body>
      <AntdRegistry>
        <ConfigProvider theme={theme}>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </ConfigProvider>
      </AntdRegistry>
      <ScrollToTop />
    </body>
  </html>
);

export default RootLayout;