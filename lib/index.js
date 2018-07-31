const Koa = require('koa');
const path = require('path');
const bodyParser = require('koa-bodyparser');
const fileServer = require('koa-static');
const helmet = require('koa-helmet');
const cors = require('@koa/cors');
const compress = require('koa-compress');
const Router = require('koa-better-router');
const koaJwt = require('koa-jwt');
const mount = require('koa-mount');
const session = require('koa-session');

const isDev = process.env.NODE_ENV === 'development' || process.env.dev == '1';
const rootPublicPath = path.resolve(process.cwd(), 'public');

const CONFIG = {
  key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
  /** (number || 'session') maxAge in ms (default is 1 days) */
  /** 'session' will result in a cookie that expires when session/browser is closed */
  /** Warning: If a session cookie is stolen, this cookie will never expire */
  maxAge: 86400000,
  overwrite: true, /** (boolean) can overwrite or not (default true) */
  httpOnly: true, /** (boolean) httpOnly or not (default true) */
  signed: true, /** (boolean) signed or not (default true) */
  rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
  renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
};

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
  app.use(session(CONFIG, app));
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
    isDev,
    listen,
  };
}

module.exports = createor;
