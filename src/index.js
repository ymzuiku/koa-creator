const Koa = require('koa');
const path = require('path');
const fs = require('fs-extra');
const bodyParser = require('koa-bodyparser');
const fileServer = require('koa-static');
const helmet = require('koa-helmet');
const cors = require('@koa/cors');
const compress = require('koa-compress');
const koajwt = require('koa-jwt');
const jwt = require('jsonwebtoken');
const mount = require('koa-mount');
const Router = require('koa-router');
const session = require('koa-session');
const { graphql, buildSchema } = require('graphql');
const threads = require('./threads');

const sessionConfig = {
  key: 'koa:sess',
  maxAge: 86400000,
  overwrite: true,
  httpOnly: true,
  signed: true,
  rolling: false,
  renew: false,
};
const isDev = process.env.prod === undefined;

const publicPath = path.resolve(process.cwd(), './public');
function createApp(staticPath = publicPath, publicUrl = '/') {
  const app = new Koa();
  app.keys = ['koa-createor-appkey'];
  if (isDev) {
    app.use(cors());
  }
  app.use(session(sessionConfig, app));
  app.use(
    compress({
      threshold: 2048,
    }),
  );
  app.use(helmet());
  app.use(
    mount(
      publicUrl,
      fileServer(staticPath, {
        gzip: true,
        maxage: isDev ? 0 : 1300000, //15天,
      }),
    ),
  );
  console.log('public path: ' + staticPath);
  app.use(
    bodyParser({
      enableTypes: ['json', 'form'],
    }),
  );
  return app;
}

function useJwt(app, secret = 'koa-createor-appkey-off-jwt') {
  app.use(koajwt({ secret }).unless({ path: [/^\/api\/login/] }));
}

function listen(app, router, port = 4100) {
  console.log('http server: http://127.0.0.1:' + port);
  if (router) {
    app.use(router.routes());
    app.use(router.allowedMethods());
  }
  app.listen(port);
}

function graph(schema, body, glfns, cb) {
  graphql(buildSchema(schema), body, glfns).then(res => {
    cb(res);
  });
}

function loadRouterDir(router, dir) {
  const stat = fs.lstatSync(dir);
  if (stat && stat.isDirectory()) {
    const files = fs.readdirSync(dir);
    for (let i = 0; i < files.length; i++) {
      const routerFn = require(path.resolve(dir, files[i]));
      routerFn(router);
    }
  }
}

function routerGraph(router, url, schema, glfns) {
  router.post(url, ctx => {
    if (ctx.request.body) {
      graph(schema, ctx.request.body.ql, glfns, res => {
        ctx.body = res;
      });
    }
  });
}

module.exports = {
  resolve: path.resolve,
  fs,
  loadRouterDir,
  createApp,
  listen,
  threads,
  graph,
  isDev,
  Router,
  routerGraph,
};
