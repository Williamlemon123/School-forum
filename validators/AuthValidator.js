const { createParameterError } = require('../utils')

class AuthValidator {
  
  postLogin (req, res, next) {
    const { username, password } = req.body
    if (!username || typeof username !== 'string') next(createParameterError('Invalid Username'))
    else if (!password || typeof password !== 'string') next(createParameterError('Invalid Password'))
    else if (username.length < 1 || username.length > 20) next(createParameterError('Username length should be 6 ~ 20.'))
    else if (password.length < 6 || username.length > 20) next(createParameterError('Password length should be 6 ~ 20.'))
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
  
}

module.exports = new AuthValidator()