const cluster = require('cluster');
const cpuCounts = require('os').cpus().length;

function thread(cpus, task = function() {}) {
  if (cpus === 'none' || cpus === undefined) {
    task();
  }
  if (cpus === 'auto' || cpus === 'auto-dev') {
    cpus = cpuCounts - 1 > 0 ? cpuCounts - 1 : 1;
  }
  if (cluster.isMaster) {
    console.log(`主进程${process.pid}正在运行`);
    for (let i = 0; i < cpus; i++) {
      cluster.fork();
    }
    cluster.on('exit', (worker, code, signal) => {
      console.log(`工作进程 ${worker.process.pid} 已退出`);
      if (cpus !== 'auto-dev') {
        cluster.fork();
      }
    });
  } else {
    console.log(`工作进程 ${process.pid} 已启动`);
    task();
  }
  return;
}

module.exports = thread;
