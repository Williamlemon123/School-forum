const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CommentSchema = new Schema(
  {
    content: { type: String },
    created_at: { type: Number },
    destroyed: { type: Boolean, default: false },
    author: {
      id: { type: String },
      username: { type: String },
      role: { type: String },
    },
    post_id: { type: String },
    reply_comment_id: { type: String, required: false, default: null },
  }
);

module.exports = mongoose.model('Comment', CommentSchema)