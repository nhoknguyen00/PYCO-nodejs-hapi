import userModel from '../model/user'
import moment from 'moment'
import debug from '../utils/debug.utils'

const NAMESPACE = `userService-${moment.utc().toISOString()}`

export const getAllUser = async () => {
  try {
    return await userModel.list()
  }
  catch (err) {
    debug.error(NAMESPACE, '', err)
    throw err
  }
}

export const getUserByUserId = async (userId) => {
  try {
    return await userModel.findById(userId)
  }
  catch (err) {
    debug.error(NAMESPACE, '', err)
    throw err
  }
}

export const createUser = async (email, name, password) => {
  try {
    const userInstance = await userModel.create({ email, name, password })
    delete userInstance.password
    return userInstance
  }
  catch (err) {
    debug.error(NAMESPACE, '', err)
    throw err
  }
}

export const findUserByEmail = async (email) => {
  try {
    const userInstance = await userModel.findByEmail(email)
    delete userInstance.password
    return userInstance
  }
  catch (err) {
    debug.error(NAMESPACE, '', err)
    throw err
  }
}

export const authenticate = async (email, password) => {
  try {
    const userInstance = await userModel.findByEmail(email)
    if (userInstance && userInstance.validPassword(password)) {
      delete userInstance.password
      return userInstance
    }
  }
  catch (err) {
    debug.error(NAMESPACE, '', err)
    throw err
  }
}

export const updateUser = async (userInstance, newEmail, newName) => {
  try {
    return await userModel.updateUser(userInstance, newEmail, newName)
  }
  catch (err) {
    debug.error(NAMESPACE, '', err)
    throw err
  }
}

export const deleteUser = async (userInstance) => {
  try {
    return await userModel.deleteUser(userInstance)
  }
  catch (err) {
    debug.error(NAMESPACE, '', err)
    throw err
  }
}

export const deleteAllUsers = async () => {
  try {
    return await userModel.deleteAllUsers()
  }
  catch (err) {
    debug.error(NAMESPACE, '', err)
    throw err
  }
}
