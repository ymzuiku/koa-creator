const {
  createApp,
  threads,
  Router,
  listen,
  resolve,
  loadRouterDir,
  graph,
} = require('../src');

threads(() => {
  const app = createApp();
  const router = new Router();
  router.get('/abc', () => {
    console.log('abc');
  });
  loadRouterDir(router, resolve(__dirname, 'routers'));
  listen(app, router, 4100);
});
