const Koa = require('koa');
const path = require('path');
const bodyParser = require('koa-bodyparser');
const fileServer = require('koa-static');
const helmet = require('koa-helmet');
const cors = require('@koa/cors');
const compress = require('koa-compress');
// const koaJwt = require('koa-jwt');
const mount = require('koa-mount');
const session = require('koa-session');
const sessionConfig = require('./sessionConfig');
const isDev = process.env.NODE_ENV === 'development' || process.env.dev;
const rootPublicPath = path.resolve(process.cwd(), 'public');

function createor(
  publicPath = rootPublicPath,
  publicUrl = '/',
  appKey = 'koa-creator',
) {
  const app = new Koa();
  app.keys = [appKey];
  if (isDev) {
    app.use(cors());
  }
  app.use(session(sessionConfig, app));
  app.use(
    compress({
      threshold: 2048,
      flush: require('zlib').Z_SYNC_FLUSH,
    }),
  );
  app.use(helmet());
  // app.use(koaJwt({ secret: 'shared-secret' }).unless({ path: [/^\/p/] }));
  app.use(
    mount(
      publicUrl,
      fileServer(publicPath, {
        gzip: true,
        maxage: isDev ? 0 : 1300000, //15天,
      }),
    ),
  );
  app.use(bodyParser());
  function listen(port = 4100) {
    app.listen(port);
    console.log('public path: ' + publicPath);
    console.log('http server: http://127.0.0.1:' + port);
  }
  return {
    app,
    listen,
  };
}

module.exports = createor;
