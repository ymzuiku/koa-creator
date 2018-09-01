const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/test');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const UserSchema = new Schema({
  author: ObjectId,
  name: { type: String, default: 'hahaha' },
  age: { type: Number, min: 18, index: true },
  bio: { type: String, match: /[a-z]/ },
  date: { type: Date, default: Date.now },
});

const User = mongoose.model('Ticket', UserSchema);

const user = new User()
