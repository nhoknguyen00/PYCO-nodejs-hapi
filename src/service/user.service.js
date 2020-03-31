import userModel from '../model/users'
import moment from 'moment'
import debug from '../utils/debug.utils'

const NAMESPACE = `userService-${moment.utc().toISOString()}`

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
