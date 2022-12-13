const { createParameterError } = require('../utils')

class PostValidator {
  
  postPost (req, res, next) {
    const { title, content, images } = req.body
    if (!title || typeof title !== 'string') next(createParameterError('Invalid Title'))
    else if (!content || typeof content !== 'string') next(createParameterError('Invalid Content'))
    else if (images &&  !(images instanceof Array)) next(createParameterError('Invalid Images'))
    else if (title.length < 1 || title.length > 100) next(createParameterError('Title length should be 1 ~ 100.'))
    else next()
  }

  postSignup (req, res, next) {
    const { username, password } = req.body
    if (!username || typeof username !== 'string') next(createParameterError('Invalid Username'))
    else if (!password || typeof password !== 'string') next(createParameterError('Invalid Password'))
    else if (username.length < 1 || username.length > 20) next(createParameterError('Username length should be 6 ~ 20.'))
    else if (password.length < 6 || username.length > 20) next(createParameterError('Password length should be 6 ~ 20.'))
    else next()
  }
  
  postComment (req, res, next) {
    const { content, postId } = req.body
    if (!content || !postId
        || typeof content !== 'string'
        || typeof postId !== 'string'
       ) next(createParameterError('Invalid Parameters'))
    else if (content.length < 1 || content.length > 150) next(createParameterError('Comment length should be 1 ~ 150.'))
    else next()
  }
  
  postLike (req, res, next) {
    const { postId } = req.body
    if (!postId || typeof postId != 'string') next(createParameterError('Invalid Parameters'))
    else next()
  }
  
}

module.exports = new PostValidator()