const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const PRIVATE_KEY = 'private-key'

const createParameterError = (msg) => {
  const err = new Error(msg || 'Parameter Error')
  err.code = 400
  return err
}

const getDate = (ts) => {
  const date = new Date(ts)
  return date.toLocaleDateString() + ' ' + date.getHours() + ':' + date.getMinutes()
}

const encryptMD5 = (plainText) => {
  return crypto.createHash('md5').update(plainText).update(PRIVATE_KEY).digest('hex')
}

const getTS = () => Date.now()

const getUnixTS = () => Math.floor(Date.now() / 1000)

const generateToken = (data) => {
  const { id, username, role } = data
  if (!id || !username || !role) return ''
  return jwt.sign({ id, username, role }, PRIVATE_KEY, { expiresIn: 3000000 })}

const decryptToken = token => {
  if (!token) return false
  const decode = jwt.verify(token, PRIVATE_KEY) || {}
  const { exp } = decode
  const current = getUnixTS()
  // if current timestamp is larger than the expire time, return false
  if (current > exp) return false
  return decode
}

module.exports = {
  createParameterError,
  encryptMD5,
  generateToken,
  decryptToken,
  getTS,
  getDate,
}