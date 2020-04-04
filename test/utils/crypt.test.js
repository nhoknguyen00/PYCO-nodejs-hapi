import crypt from '../../src/utils/crypt.utils'
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../../src/config/index'

describe('Utilities unit tests', () => {
  test('Comparing password', () => {
    const hashedPass = crypt.hashPassword('123456789')
    expect(crypt.comparePassword('123456789', hashedPass)).toBe(true)
  })

  test('Test create authorization token', () => {
    const randomUUID = uuidv4()
    const authToken = crypt.createAuthToken(randomUUID)
    const { id } = jwt.verify(authToken, JWT_SECRET)
    expect(id).toBe(randomUUID)
  })

})
