import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	// Every page is built ahead of time and served as static files; redirects
	// live in public/_redirects, which the static host applies.
	output: 'export',
	// No server to resize images on request.
	images: { unoptimized: true },
	reactStrictMode: true,
	pageExtensions: ['ts', 'tsx'],
	transpilePackages: ['next-mdx-remote'],
};

export default nextConfig;
