/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Environment variables validation
  env: {
    NEXT_PUBLIC_APP_NAME: 'OWi',
    NEXT_PUBLIC_APP_DESCRIPTION: 'AI-powered gold autoswap platform',
  },
  // Allow external packages for wallet connections
  transpilePackages: ['wagmi', 'viem', '@coinbase/onchainkit'],
  // Turbopack config for Next.js 16+
  turbopack: {
    resolveAlias: {
      // Turbopack handles web3 polyfills differently
      // These fallbacks are handled automatically by Turbopack
    },
  },
  // Webpack config for web3 compatibility (legacy fallback)
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    }
    return config
  },
}

export default nextConfig
