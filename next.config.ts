import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your Next.js config here
  webpack: (webpackConfig: any) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  // During build, skip routes that require runtime database access
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
