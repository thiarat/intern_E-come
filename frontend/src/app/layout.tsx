import Navbar from '@/components/Navbar';
import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'EcomDelivery - Shop & Fast Delivery',
  description: 'The best e-commerce and delivery platform in Thailand',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-1 w-full max-w-7xl mx-auto md:px-6">
          {children}
        </main>
        <footer className="bg-white border-t py-8 mt-12">
          <div className="container mx-auto px-4 md:px-6 text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} EcomDelivery. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
