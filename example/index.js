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
} = require('../src');

threads(() => {
  connectMongodb(db => {
    db.collection('test').deleteMany();
    const app = createApp();
    const router = new Router();
    useJwt(app, 'fdjaklfdafsfjkldsajfksjafkdsajfkljdsklfjdskaljfklsad');
    router.get('/api/p/login', ctx => {
      ctx.body = 'ok login';
    });
    router.get('/api/unjwt/bb', ctx => {
      ctx.body = 'ok abc';
    });
    router.get('/api-p/bb', ctx => {
      ctx.body = 'ok unjwt bb';
    });
    router.post('/api-p/postdb', ctx => {
      // ctx.request.body
      db.collection('test').insertOne(autoSetTime(ctx.request.body, true));
      ctx.body = ctx.request.body;
    });
    loadRouterDir(router, resolve(__dirname, 'routers'));
    listen(app, router, 4100);
  });
});
