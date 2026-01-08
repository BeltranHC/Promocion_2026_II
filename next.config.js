/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        unoptimized: false,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                pathname: '/**',
            },
        ],
    },
};

module.exports = nextConfig;

