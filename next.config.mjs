const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000' },
  // Only directives that don't need per-request nonces, so every public page can stay static.
  {
    key: 'Content-Security-Policy',
    value: "frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'",
  },
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [60, 75],
  },
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      {
        source: '/admin/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
      {
        source: '/api/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
          { key: 'Cache-Control', value: 'no-store' },
        ],
      },
    ]
  },
  async redirects() {
    return [
      {
        // One canonical host (lib/site-config.ts). Needs www.mailra.nl added as a domain in Vercel.
        source: '/:path*',
        has: [{ type: 'host', value: 'www.mailra.nl' }],
        destination: 'https://mailra.nl/:path*',
        permanent: true,
      },
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
