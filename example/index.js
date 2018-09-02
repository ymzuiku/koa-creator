const {
  createApp,
  threads,
  Router,
  listen,
  resolve,
  loadRouterDir,
  useJwt,
  autoSetTime,
  connectMongodb,
  isDev,
} = require('../src');

threads(3, () => {
  const mongoUrl = isDev ? 'mongodb://127.0.0.1:27017' : 'mongodb://mongo:27017';
  connectMongodb(mongoUrl, db => {
    db.collection('test').deleteMany();
    const app = createApp();
    const router = new Router();
    useJwt(app);
    router.get('/api/p/login', ctx => {
      ctx.body = 'ok login';
    });
    router.get('/api/unjwt/bb', ctx => {
      ctx.body = 'ok abc';
    });
    router.get('/api/p/bb', ctx => {
      ctx.body = 'ok unjwt bb';
    });
    router.post('/api/p/postdb', ctx => {
      db.collection('test').insertOne(autoSetTime(ctx.request.body, true));
      ctx.body = ctx.request.body;
    });
    loadRouterDir(router, resolve(__dirname, 'routers'));
    listen(app, router, 4100);
  });
});
