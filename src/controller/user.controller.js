import * as userService from '../service/user.service'
import crypt from '../utils/crypt.utils'
import Boom from 'boom'

export const getAllUser = async (request, h) => {
  return await userService.getAllUser()
}

export const getUserByUserId = async (request, h) => {
  const { userId } = request.params

  const userInstance = await userService.getUserByUserId(userId)
  if (userInstance) {
    return userInstance
  }
  return Boom.badRequest(`User with id ${userId} is not existed`)
}

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

export const updateUserByUserId = async (request, h) => {
  const { userId } = request.params

  const userInstance = await userService.getUserByUserId(userId)
  if (userInstance) {
    const { email, name } = request.payload
    return await userService.updateUser(userInstance, email, name)
  }
  return Boom.badRequest(`User with id ${userId} is not existed`)
}

export const deleteUserByUserId = async (request, h) => {
  const { userId } = request.params

  const userInstance = await userService.getUserByUserId(userId)
  if (userInstance) {
    return await userService.deleteUser(userInstance)
  }
  return Boom.badRequest(`User with id ${userId} is not existed`)
}

export const deleteAllUsers = async (request, h) => {
  return await userService.deleteAllUsers()
}
