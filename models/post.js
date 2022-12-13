const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PostSchema = new Schema(
  {
    title: { type: String },
    content: { type: String },
    created_at: { type: Number },
    updated_at: { type: Number },
    images: { type: Array, default: [] },
    author: {
      id: { type: String },
      username: { type: String },
      role: { type: String },
    },
    likes: { type: Array, default: [] },
    dislikes: { type: Array, default: [] },
    views: { type: Array, default: [] },
  }
);

module.exports = mongoose.model('Post', PostSchema)