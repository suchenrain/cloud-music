const path = require('path');

const resolvePath = function (location) {
  return path.resolve(__dirname, location);
};

module.exports = {
  webpack: {
    alias: {
      '@components': resolvePath('src/components/'),
      '@application': resolvePath('src/application/'),
      '@assets': resolvePath('src/assets/'),
      '@routes': resolvePath('src/routes/'),
      '@baseUI': resolvePath('src/baseUI/'),
      '@api': resolvePath('src/api/'),
      '@store': resolvePath('src/store/'),
    },
  },
};
