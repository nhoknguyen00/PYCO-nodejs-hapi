import * as userService from '../service/user.service'
import crypt from '../utils/crypt.utils'
import Boom from 'boom'

export const registerUser = async (request, h) => {
  const { email, name, password } = request.payload
  const userInstance = await userService.findUserByEmail(email)
  if (!userInstance) {
    return await userService.createUser(email, name, password)
  }
  return Boom.badRequest('Email is already in use')
}

export const loginUser = async (request, h) => {
  const { email, password } = request.payload

  const userInstance = await userService.authenticate(email, password)
  if (userInstance) {
    const token = crypt.createAuthToken(userInstance._id)
    const response = { userInstance, token }
    return response
  }
  return Boom.unauthorized('Invalid email or password')
}
