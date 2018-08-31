const { Router, routerGraph } = require('../../src');

const schema = `
    type Query {
        hello: String
    }
`;

module.exports = function(router = new Router()) {
  routerGraph(router, '/gl', schema, {
    hello: () => 'hello订单',
  });
};
