import crypt from '../../src/utils/crypt.utils'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../../src/config/index'

describe('Unit test all ultilities', () => {
  test('Test create authorization token: ', () => {
    const authToken = crypt.createAuthToken('testuuid')
    const { id } = jwt.verify(authToken, JWT_SECRET)
    expect(id).toBe('testuuid')
  })

})
