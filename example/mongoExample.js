const { MongoClient, Db } = require('mongodb');
const Mock = require('mockjs');
MongoClient.connect(
  'mongodb://127.0.0.1:27017',
  { useNewUrlParser: true },
  (err, client) => {
    const testDb = client.db('test');
    insertDocuments(testDb);
  },
);

const mockdata = Mock.mock({
  'users|10': [
    {
      name: '@string',
      'age|0-100': 0,
    },
  ],
});

function insertDocuments(db = new Db()) {
  const collection = db.collection('users');
  collection.deleteMany()
  collection.insertMany(mockdata.users);
}
