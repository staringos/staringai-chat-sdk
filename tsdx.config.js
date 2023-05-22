const postcss = require('rollup-plugin-postcss');
const dotenv = require('rollup-plugin-dotenv');

module.exports = {
  target: 'browser',
  format: 'umd',
  rollup(config, options) {
    config.plugins.unshift(dotenv.default());
    config.plugins.push(
      postcss({
        inject: true,
        extract: false,
        modules: true,
        autoModules: /\.mod\.\S+$/,
      }),
    );
    return config;
  },
};