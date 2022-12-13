const { User } = require('../models')
const { encryptMD5, generateToken } = require('../utils')

class AuthController {
  
  async login (req, res, next) {
    const { username, password } = req.body
    try {
      const user = await User.findOne({
        username,
        password: encryptMD5(password),
      }, '_id username role')

      if (!user) throw new Error('Incorrect Username or Password')
      const token = generateToken({
        id: user._id,
        username: user.username,
        role: user.role,
      })
      req.session.token = token

      res.json({
        code: 200,
        msg: 'signed in',
        data: { user, token },
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * register new user account
   */
  async signup (req, res, next) {
    const { username, password } = req.body
    try {
      const user = await User.findOne({ username })
      if (user) throw new Error('User Exists!')

      const newUser = await User.create({
        username,
        password: encryptMD5(password),
        role: 'user'
      })
      res.json({
        code: 201,
        msg: 'created',
        data: newUser._id,
      })

    } catch (error) {
      next(error)
    }
  }

  async logout (req, res, next) {
    req.session.token = null
    res.json({
      code: 200,
      msg: 'Signed Out',
    })
  }
  
}

module.exports = new AuthController()