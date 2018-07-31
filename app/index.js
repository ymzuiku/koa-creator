const creator = require('../lib');
const { app, listen } = creator();
app.use(async ctx => {
  ctx.body = { name: 'bb', dog: 123 };
});

listen(4100);
