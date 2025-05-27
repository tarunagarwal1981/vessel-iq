/** @type {import('next').NextConfig} */
const nextConfig = {
    // Remove or comment out: output: 'standalone',
    images: {
        unoptimized: true
    },
    webpack: (config) => {
        config.module.rules.push({
            test: /\.(ico|png|svg|jpg|jpeg|gif)$/,
            type: 'asset/resource'
        });
        return config;
    }
}

module.exports = nextConfig
