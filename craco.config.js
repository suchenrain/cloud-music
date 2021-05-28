const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@components': path.resolve(__dirname, 'src/components/'),
      '@application': path.resolve(__dirname, 'src/application/'),
      '@assets': path.resolve(__dirname, 'src/assets/'),
      '@routes': path.resolve(__dirname, 'src/routes/'),
      '@baseUI': path.resolve(__dirname, 'src/baseUI/'),
      '@api': path.resolve(__dirname, 'src/api/'),
      '@store': path.resolve(__dirname, 'src/store/'),
    },
  },
};
