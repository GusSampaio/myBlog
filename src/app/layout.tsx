
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ML Portfolio Pro',
  description: 'Machine Learning Portfolio and Blog',
  keywords: ['machine learning', 'portfolio', 'blog', 'deep learning', 'AI'],
  authors: [{ name: 'Your Name' }],
  creator: 'Firebase Studio',
  openGraph: {
    title: 'ML Portfolio Pro',
    description: 'Machine Learning Portfolio and Blog',
    url: 'https://yourdomain.com',
    siteName: 'ML Portfolio Pro',
    images: [
      {
        url: 'https://yourdomain.com/og.png', // Replace with your OG image
        width: 800,
        height: 600,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ML Portfolio Pro',
    description: 'Machine Learning Portfolio and Blog',
    images: ['https://yourdomain.com/og.png'], // Replace with your OG image
    creator: '@yourTwitterHandle',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': 'large',
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google', // Add your google verification code
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
