/**
 * Webpack setup based on
 *
 * survivejs
 * https://github.com/survivejs-demos/webpack-demo
 *
 * react-universal-component
 * https://github.com/faceyspacey/redux-first-router-demo
 *
 * backpack
 * https://github.com/jaredpalmer/backpack
 *
 */
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const lodashPick = require('lodash/pick');
const parts = require('./webpack.parts');
const dotenv = require('dotenv');


const envs = dotenv.load({ path: path.resolve(__dirname, '..', '.env') });
// Expose selected envs to client
const clientEnvs = lodashPick(envs.parsed, [
  'STRIPE_API_KEY',
  'SENTRY_CLIENT_CONFIG_URL',
]);
Object.keys(clientEnvs).forEach(( key ) => {
  clientEnvs[key] = JSON.stringify(clientEnvs[key]);
});

const PATHS = {
  src: path.resolve(__dirname, '..', 'src'),
  serverEntry: path.resolve(__dirname, '..', 'src', 'server', 'render.js'),
  serverBuild: path.resolve(__dirname, '..', 'build', 'server'),
  node_modules: path.resolve(__dirname, '..', 'node_modules'),
  webpackCache: path.resolve(__dirname, 'serverCache'),
};

// if you're specifying externals to leave unbundled, you need to tell Webpack
// to still bundle `react-universal-component`, `webpack-flush-chunks` and
// `require-universal-module` so that they know they are running
// within Webpack and can properly make connections to client modules:
const whitelist = [
  '\\.bin',
  'react-universal-component',
  'require-universal-module',
  'webpack-flush-chunks',
];
const whiteListRE = new RegExp(whitelist.join('|'));
const externals = fs
  .readdirSync(PATHS.node_modules)
  .filter((x) => !whiteListRE.test(x))
  .reduce((_externals, mod) => {
    _externals[mod] = `commonjs ${mod}`;
    return _externals;
  }, {});

const commonConfig = webpackMerge([
  {
    // 'server' name required by webpack-hot-server-middleware, see
    // https://github.com/60frames/webpack-hot-server-middleware#usage
    name: 'server',
    target: 'node',
    bail: true,
    entry: [
      'babel-polyfill',
      'fetch-everywhere',
      PATHS.serverEntry,
    ],
    externals,
    output: {
      path: PATHS.serverBuild,
      filename: '[name].js',
      libraryTarget: 'commonjs2',
    },
    resolve: {
      modules: [
        PATHS.node_modules,
        PATHS.src,
      ],
    },
    plugins: [
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1,
      }),
    ],
  },
  parts.ignoreCSS(),
  parts.loadJavascript({
    include: PATHS.src,
    cacheDirectory: PATHS.webpackCache,
  }),
  parts.serverRenderSCSS({
    cssModules: true,
    exclude: /node_modules/,
  }),
]);

const DevEnvs = Object.assign(
  {},
  {
    'process.env': {
      NODE_ENV: JSON.stringify('development'),
    },
    __SERVER__: 'true',
    __CLIENT__: 'false',
    __TEST__: 'false',
  },
  clientEnvs
);
const developmentConfig = webpackMerge([
  {
    devtool: 'eval',
    output: {
      publicPath: '/static/',
    },
    plugins: [
      new webpack.DefinePlugin(DevEnvs),
    ],
  },
]);

const ProdEnvs = Object.assign(
  {},
  {
    'process.env': {
      NODE_ENV: JSON.stringify('production'),
    },
    __SERVER__: 'true',
    __CLIENT__: 'false',
    __TEST__: 'false',
  },
  clientEnvs
);
const productionConfig = webpackMerge([
  {
    devtool: 'source-map',
    plugins: [
      new webpack.DefinePlugin(ProdEnvs),
    ],
  },
]);


module.exports = ( env ) => {
  if ( env === 'production' ) {
    return webpackMerge( commonConfig, productionConfig );
  }
  return webpackMerge( commonConfig, developmentConfig );
};
