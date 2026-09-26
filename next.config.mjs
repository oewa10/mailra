/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    return [
      {
        // Category filters used to be a query string; they are static pages now.
        source: '/producten',
        has: [{ type: 'query', key: 'category', value: '(?<category>[a-z0-9-]+)' }],
        destination: '/producten/:category',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
