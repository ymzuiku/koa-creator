const cluster = require('cluster');
let cpuCounts = require('os').cpus().length;
cpuCounts = cpuCounts === 2 ? 1 : cpuCounts;

const isDev = process.env.prod === undefined;

module.exports = function(task) {
  if (isDev) {
    task();
    return;
  }
  if (cluster.isMaster) {
    console.log(`Process: ${process.pid} runing...`);
    for (let i = 0; i < cpuCounts; i++) {
      cluster.fork();
    }
    cluster.on('exit', (worker, code, signal) => {
      console.log(`worker ${worker.process.pid} exit`);
      cluster.fork();
    });
  } else {
    console.log(`worker ${process.pid} start`);
    task();
  }
  return;
};
