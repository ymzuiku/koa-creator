const { creator, thread } = require('../lib');

thread('auto-dev', function() {
  const { app, listen } = creator();
  app.use(async ctx => {
    ctx.body = { name: 'bb', dog: 123 };
  });
  listen(4100);
});

