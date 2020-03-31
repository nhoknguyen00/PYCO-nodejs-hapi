import { SALT_ROUNDS, JWT_SECRET, TOKEN_EXPIRED_TIME } from '../config'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt-nodejs'

const hashPassword = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(SALT_ROUNDS))
}

const comparePassword = (password, hash) => {
  return bcrypt.compareSync(password, hash)
}

const createAuthToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: TOKEN_EXPIRED_TIME })
}

export default {
  hashPassword,
  comparePassword,
  createAuthToken
}
