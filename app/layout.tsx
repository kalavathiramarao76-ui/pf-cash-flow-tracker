use client;

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useTheme } from '../context/ThemeContext';
import Nav from '../components/Nav';
import Footer from '../components/Footer';

export default function RootLayout({ children }) {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, []);

  return (
    <html lang="en" className={theme}>
      <Head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Cash Flow Tracker</title>
        <meta name="description" content="Automated cash flow management for small businesses and freelancers" />
        <meta name="keywords" content="cash flow management, small business finance, expense tracking, budgeting tools, financial forecasting" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@cashflowtracker" />
        <meta name="twitter:title" content="Cash Flow Tracker" />
        <meta name="twitter:description" content="Automated cash flow management for small businesses and freelancers" />
        <meta name="twitter:image" content="/twitter-card.png" />
        <meta property="og:title" content="Cash Flow Tracker" />
        <meta property="og:description" content="Automated cash flow management for small businesses and freelancers" />
        <meta property="og:image" content="/og-image.png" />
        <meta property="og:url" content="https://cashflowtracker.com" />
        <meta property="og:site_name" content="Cash Flow Tracker" />
      </Head>
      <body className="flex flex-col min-h-screen">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}