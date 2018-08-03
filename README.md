# Koa-creator

# 注意！这个库还未开发完毕

只需要几行命令就可以快速启动一个包含 gzip，static-server，deamon，多线程的 koa 服务

```js
const { creator, thread } = require('koa-creator');

thread('auto', false, () => {
  const { app, listen } = creator();

  app.use(async (ctx, next) => {
    await next();
    if (ctx.path !== '/api/a') return;
    ctx.body = { name: 'test-a', age: 200 };
  });

  listen(4000);
});
```
