const {
  createApp,
  threads,
  Router,
  listen,
  resolve,
  loadRouterDir,
  useJwt,
} = require('../src');

threads(() => {
  const app = createApp();
  useJwt(app, 'fdjsklafjdlksaf');
  const router = new Router();
  router.get('/abc', () => {
    console.log('abc');
  });
  loadRouterDir(router, resolve(__dirname, 'routers'));
  listen(app, router, 4100);
});
