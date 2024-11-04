/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    images: {
        unoptimized: true
    },
    // Add favicon configuration
    webpack: (config) => {
        config.module.rules.push({
            test: /\.(ico|png|svg|jpg|jpeg|gif)$/,
            type: 'asset/resource'
        });
        return config;
    }
}

module.exports = nextConfig
