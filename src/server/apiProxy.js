import httpProxy from 'http-proxy';
import serializeError from 'serialize-error';
import Raven from 'raven';


function createProxy( target ) {
  const proxy = httpProxy.createProxyServer();

  proxy.on('error', (error, req, res) => {
    // Log error to stderr
    console.error(error); // eslint-disable-line no-console

    // Report error to error service
    Raven.captureException(error);

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
      ...serializeError(error),
    });
  });

  return (req, res, next) => {
    proxy.web(req, res, {
      target,
      changeOrigin: true,
    }, ( error ) => {
      next(error);
    });
  };

}

export default createProxy;
