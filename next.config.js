// next.config.js
module.exports = {
  output: 'export',         // Enables static export
  images: {
    unoptimized: true       // Disables Next.js image optimization for static export
  }
};
