export default {
  experimental: {
    appDir: true,
    runtime: 'nodejs',
    serverComponents: true,
  },
  future: {
    strictPostcssConfiguration: true,
  },
  images: {
    domains: [],
    formats: ['image/avif', 'image/webp'],
  },
  reactStrictMode: true,
  tailwindcss: {},
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
    };
    return config;
  },
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },
  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: 'default-src \'self\'; script-src \'self\' https:; object-src \'none\'',
          },
        ],
      },
    ];
  },
};