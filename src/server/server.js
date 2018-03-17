import 'fetch-everywhere';
import colors from 'colors/safe';
import express from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import Raven from 'raven';
import serializeError from 'serialize-error';

import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackHotServerMiddleware from 'webpack-hot-server-middleware';
import clientConfigFactory from '../../webpack/webpack.client.config';
import serverConfigFactory from '../../webpack/webpack.server.config';
import dotenv from 'dotenv';
import path from 'path';
import createProxy from 'server/apiProxy';


function setupErrorHandling() {
  // setup sentry error reporting, only in production environment
  const ravenConfigUrl = process.env.NODE_ENV === 'production'
    ? process.env.SENTRY_CONFIG_URL
    : false;

  Raven.config(ravenConfigUrl).install();

  // Ensure that unhandledRejection is logged and exits the server
  process.on('unhandledRejection', (error) => {
    console.error('unhandledRejection'); // eslint-disable-line no-console
    console.error(error); // eslint-disable-line no-console
    Raven.captureException(error, ( /* sendErr, eventId */ ) => {
      process.exit(1);
    });
  });
}

// NOTE: We're going to override the default express middleware
function handleErrorMiddleware( err, req, res, next ) { // eslint-disable-line no-unused-vars
  console.error('handleErrorMiddleware'); // eslint-disable-line no-console
  console.error(err); // eslint-disable-line no-console

  // In production, hide the error, return a generic `internal_server_error` response
  if ( process.env.NODE_ENV === 'production' ) {
    res.status(500);
    res.json({
      internal_server_error: true,
    });
    return;
  }
  // In development, expose the error details to the client
  res.status(500);
  res.json({
    internal_server_error: true,
    ...serializeError(err),
  });
}

function setupWebackDevMiddleware(app) {
  const clientConfig = clientConfigFactory('development');
  const serverConfig = serverConfigFactory('development');
  const multiCompiler = webpack([ clientConfig, serverConfig ]);

  // HACK: Fix for repeated recompiles in dev mode
  // https://github.com/webpack/watchpack/issues/25#issuecomment-319292564
  multiCompiler.compilers.forEach(( compiler ) => {
    const timefix = 11000;
    compiler.plugin('watch-run', (watching, callback) => {
      watching.startTime += timefix;
      callback();
    });
    compiler.plugin('done', (stats) => {
      stats.startTime -= timefix;
    });
  });

  const clientCompiler = multiCompiler.compilers[0];
  app.use(webpackDevMiddleware(multiCompiler, {
    publicPath: clientConfig.output.publicPath,
  }));
  app.use(webpackHotMiddleware(clientCompiler));
  app.use(webpackHotServerMiddleware(multiCompiler));

  return new Promise((resolve /* ,reject */) => {
    multiCompiler.plugin('done', resolve);
  });
}

async function setupWebpack( app ) {
  const clientConfig = clientConfigFactory('development');
  const publicPath = clientConfig.output.publicPath;
  const outputPath = clientConfig.output.path;
  if ( process.env.NODE_ENV !== 'production' ) {
    await setupWebackDevMiddleware(app);
  }
  else {
    const clientStats = require('../client/stats.json');
    const serverRender = require('../server/main.js').default;

    app.use(publicPath, express.static(outputPath));
    app.use(serverRender({ clientStats, outputPath }));
  }
}

function startServer( app ) {
  return new Promise((resolve, reject) => {
    app.listen(process.env.SERVER_PORT, (err) => {
      if ( err ) {
        console.log(err); // eslint-disable-line no-console
        reject(err);
      }
      console.log(colors.black.bold('⚫⚫')); // eslint-disable-line no-console
      console.log(colors.black.bold(`⚫⚫ Web server listening on port ${process.env.SERVER_PORT}...`)); // eslint-disable-line no-console
      console.log(colors.black.bold('⚫⚫\n')); // eslint-disable-line no-console
    });
  });
}

function loadEnv() {
  dotenv.config({
    path: path.resolve(__dirname, '../../.env'),
  });

  if ( !process.env.SERVER_PORT ) {
    console.log('SERVER_PORT not set in .env file, defaulting to 3000'); // eslint-disable-line no-console
    process.env.SERVER_PORT = 3000;
  }

  if ( !process.env.API_URL ) {
    console.log('API_URL not set in .env file'); // eslint-disable-line no-console
  }
}

async function pingApi() {
  // Ping API Server
  const response = await fetch( process.env.API_URL );
  if ( response && response.ok ) {
    console.log(colors.black.bold('⚫⚫')); // eslint-disable-line no-console
    console.log(colors.black.bold(`⚫⚫ Connected to API server at ${process.env.API_URL}`)); // eslint-disable-line no-console
    console.log(colors.black.bold('⚫⚫\n')); // eslint-disable-line no-console
  }
  else {
    throw new Error(`Cannot ping API server at ${process.env.API_URL}. Status: ${response.status}`);
  }
}

async function bootstrap() {
  let offlineMode = false;
  loadEnv();

  try {
    await pingApi();
  }
  catch ( error ) {
    console.log(colors.red.bold('🔴🔴')); // eslint-disable-line no-console
    console.log(colors.red.bold('🔴🔴 API not configured, proceeding with offline mode')); // eslint-disable-line no-console
    console.log(colors.red.bold('🔴🔴\n')); // eslint-disable-line no-console
    offlineMode = true;
  }

  // setup error logging
  setupErrorHandling();

  const app = express();

  // middleware
  if ( process.env.NODE_ENV === 'production' ) {
    app.use(Raven.requestHandler());
  }
  app.use( express.static('public') );
  app.all('/favicon.*', (req, res) => {
    res.status(404).end();
  });
  app.use(morgan('[:date[iso]] :method :url :status :response-time ms - :res[content-length]'));
  app.use(helmet.noSniff());
  app.use(helmet.ieNoOpen());
  app.use(helmet.hidePoweredBy());
  app.use(compression());
  app.use(cookieParser());

  // Send dummy JSON response if offline
  if ( offlineMode ) {
    app.all('/api/*', (req, res) => res.send({}));
  }
  // Proxy to API
  app.all('/api/*', createProxy( process.env.API_URL ));

  await setupWebpack(app);

  if ( process.env.NODE_ENV === 'production' ) {
    app.use(Raven.errorHandler());
  }
  app.use(handleErrorMiddleware);
  await startServer(app);

}

bootstrap()
  .catch((error) => {
    console.log(error); // eslint-disable-line no-console
  });

