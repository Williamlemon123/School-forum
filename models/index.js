const UserSchema = require('./user')
const PostSchema = require('./post')
const CommentSchema = require('./comment')

// Export model
module.exports = {
  User: UserSchema,
  Post: PostSchema,
  Comment: CommentSchema,
}