const { MongoClient, Db } = require('mongodb');

const defUrl = 'mongodb://127.0.0.1:27017';
const defDbName = 'test';
const defDbCallback = (db = new Db()) => {};
function connectMongodb(
  url = defDbCallback,
  dbName = defDbCallback,
  callback = defDbCallback,
) {
  if (typeof url === 'function') {
    callback = url;
    url = defUrl;
  } else if (typeof dbName === 'function') {
    callback = dbName;
    dbName = defDbName;
  }
  MongoClient.connect(
    url,
    { useNewUrlParser: true },
    (err, client) => {
      const db = client.db(dbName);
      callback(db);
    },
  );
}

function chinaTime(date) {
  var timezone = 8; //目标时区时间，东八区
  var offset_GMT = date.getTimezoneOffset(); // 本地时间和格林威治的时间差，单位为分钟
  var nowDate = date.getTime(); // 本地时间距 1970 年 1 月 1 日午夜（GMT 时间）之间的毫秒数
  return new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000);
}

function autoSetTime(obj, isCreate, isGMT) {
  let time = new Date();
  if (!isGMT) {
    time = chinaTime(time);
  }
  if (isCreate) {
    obj.createAt = time;
  }
  obj.updateAt = time;
  return obj;
}

module.exports = {
  connectMongodb,
  Db,
  autoSetTime,
  chinaTime,
};
