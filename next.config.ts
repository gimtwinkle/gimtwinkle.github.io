import { NextConfig } from './node_modules/next/types';

const nextConfig: NextConfig = {
	output: 'export',
	images: {
		unoptimized: true,
	},
};

export default nextConfig;
