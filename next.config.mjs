/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  basePath: '',
  images: {
    loader: 'akamai',
    path: '',
  },
  assetPrefix: './',
}

export default nextConfig
