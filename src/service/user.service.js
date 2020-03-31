import userModel from '../model/users'
import moment from 'moment'
import debug from '../utils/debug.utils'

const NAMESPACE = `userService-${moment.utc().toISOString()}`

export const createUser = async (email, name, password) => {
  try {
    const userInstance = await userModel.create({ email, name, password })
    return userInstance
  }
  catch (err) {
    debug.err(NAMESPACE, '', err)
    throw err
  }
}
