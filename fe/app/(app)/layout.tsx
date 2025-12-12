import React from 'react';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Navbar />
      <main className="landing-content" >
        {children}
      </main>
      <Footer />
    </div>
  );
}
