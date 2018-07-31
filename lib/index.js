const thread = require('./thread');
const sessionConfig = require('./sessionConfig');
const creator = require('./creator');
const isDev = process.env.NODE_ENV === 'development' || process.env.dev;

module.exports = {
  isDev,
  thread,
  sessionConfig,
  creator,
};
