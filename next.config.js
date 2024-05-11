/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "images.unsplash.com",
			},
			{
				protocol: "https",
				hostname: "source.unsplash.com",
			},
			{
				protocol: "https",
				hostname: "avatars.githubusercontent.com",
			},
			{
				protocol: "https",
				hostname: "3xpl.com",
			},
			{
				protocol: "https",
				hostname: "rogerweb.vercel.app",
			},
		],
	},
  webpack: (config, { isServer }) => {
    config.externals = [...config.externals, ({ request }, callback) => {
      if (/^node-gyp-build$/.test(request)) {
        return callback(null, request);
      }
      callback();
    }];


    return config;
  },
};

module.exports = nextConfig;
