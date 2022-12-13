const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema(
  {
    username: { type: String },
    password: { type: String },
    role: { type: String },
  }
);

module.exports = mongoose.model('User', UserSchema)