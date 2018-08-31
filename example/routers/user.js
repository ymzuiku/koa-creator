const Router = require('koa-router');

module.exports = function(router = new Router()) {
  router.get('/aa', ctx => {
    console.log('aaa-auto');
  });
};
