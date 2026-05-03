/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },

  // Serve static HTML pages at clean URLs
  async rewrites() {
    return [
      { source: "/advisor", destination: "/advisor.html" },
    ]
  },

  // Security headers on every response
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Block embedding your site in iframes on other sites (clickjacking)
          { key: "X-Frame-Options", value: "DENY" },
          // Stop browsers from guessing file types (MIME sniffing)
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Only share referrer with same origin
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Disable browser features not needed by this app
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
          // Force HTTPS for 1 year and all subdomains (HSTS)
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
          // Legacy XSS protection for older browsers
          { key: "X-XSS-Protection", value: "1; mode=block" },
        ],
      },
    ]
  },
}

export default nextConfig
