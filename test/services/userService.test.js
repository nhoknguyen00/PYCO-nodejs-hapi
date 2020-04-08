import * as userService from '../../src/service/user.service'
import * as authorizeService from '../../src/service/authorize.service'
import mongoose from 'mongoose'
import config from '../../src/config/index'
import crypt from '../../src/utils/crypt.utils'

const userData = {
  email: 'testemail@gmail.com',
  name: 'test name',
  password: '123456789'
}

// jest.mock('../../src/model/user', () => ({
//   list: () => Promise.resolve([{
//     _id: '98c75065-0cb5-4110-8424-1189e51747c2',
//     email: 'miketuannguyen@gmail.com',
//     name: 'Nguyen Luu Tuan',
//     password: '$2a$08$eiqDPrFq6n5jfnN6U1Q5d.lsPZPkAkEXg.eTXI6q0/YUAIH4IrKw6',
//     isDeleted: false,
//     createdAt: new Date(),
//     updatedAt: new Date()
//   }, {
//     _id: '00394bbc-bf8a-4336-b02c-6e3c38f42675',
//     email: '1612434@student.hcmus.edu.vn',
//     name: 'Nguyen Mike Tuan',
//     password: '$2a$08$eiqDPrFq6n5jfnN6U1Q5d.lsPZPkAkEXg.eTXI6q0/YUAIH4IrKw6',
//     isDeleted: false,
//     createdAt: new Date(),
//     updatedAt: new Date()
//   }]),
//   findById: (id) => Promise.resolve({
//     _id: id,
//     email: 'miketuannguyen@gmail.com',
//     name: 'Nguyen Luu Tuan',
//     password: '$2a$08$eiqDPrFq6n5jfnN6U1Q5d.lsPZPkAkEXg.eTXI6q0/YUAIH4IrKw6',
//     isDeleted: false,
//     createdAt: new Date(),
//     updatedAt: new Date()
//   }),
//   findByEmail: (email) => Promise.resolve({
//     _id: '00394bbc-bf8a-4336-b02c-6e3c38f42675',
//     email: email,
//     name: 'Nguyen Luu Tuan',
//     password: '$2a$08$eiqDPrFq6n5jfnN6U1Q5d.lsPZPkAkEXg.eTXI6q0/YUAIH4IrKw6',
//     isDeleted: false,
//     createdAt: new Date(),
//     updatedAt: new Date()
//   }),
//   create: (userInfo) => Promise.resolve({
//     _id: '00394bbc-bf8a-4336-b02c-6e3c38f42675',
//     ...userInfo,
//     isDeleted: false,
//     createdAt: new Date(),
//     updatedAt: new Date()
//   }),
//   updateUser: (userInstance, newEmail, newName) => Promise.resolve({
//     _id: userInstance._id,
//     email: newEmail,
//     name: newName,
//     isDeleted: false,
//     createdAt: new Date(),
//     updatedAt: new Date()
//   }),
//   deleteUser: (userInstance) => Promise.resolve({
//     ...userInstance,
//     isDeleted: false
//   }),
//   deleteAllUsers: () => ([{
//     _id: '98c75065-0cb5-4110-8424-1189e51747c2',
//     email: 'miketuannguyen@gmail.com',
//     name: 'Nguyen Luu Tuan',
//     password: '$2a$08$eiqDPrFq6n5jfnN6U1Q5d.lsPZPkAkEXg.eTXI6q0/YUAIH4IrKw6',
//     isDeleted: true,
//     createdAt: new Date(),
//     updatedAt: new Date()
//   }, {
//     _id: '00394bbc-bf8a-4336-b02c-6e3c38f42675',
//     email: '1612434@student.hcmus.edu.vn',
//     name: 'Nguyen Mike Tuan',
//     password: '$2a$08$eiqDPrFq6n5jfnN6U1Q5d.lsPZPkAkEXg.eTXI6q0/YUAIH4IrKw6',
//     isDeleted: true,
//     createdAt: new Date(),
//     updatedAt: new Date()
//   }])
// }))

const connectMongo = async () => {
  let mongoConnection
  beforeAll(async () => {
    mongoConnection = await mongoose.connect(config.mongoUri, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: true
    }, (err) => {
      if (err) {
      // eslint-disable-next-line no-console
        console.error(err)
        process.exit(1)
      }
    })
  })

  afterAll(async () => {
    await mongoConnection.close()
    process.exit(1)
  })
}

let testCreatedUser
let testUpdatedUser

describe('Create user service test suite', () => {
  connectMongo()
  test('Test create user service', async () => {
    testCreatedUser = await userService.createUser(userData.email, userData.name, userData.password)
    expect(testCreatedUser._id).toBeDefined()
    expect(testCreatedUser.email).toBe(userData.email)
    expect(testCreatedUser.name).toBe(userData.name)
    expect(testCreatedUser.isDeleted).toBe(false)
  })
})

describe('Authorize service test suite', () => {
  connectMongo()

  test('Get user with valid token', async () => {
    const authToken = 'Bearer ' + crypt.createAuthToken(testCreatedUser._id)

    const userResult = await authorizeService.getUserByAuthToken(authToken)
    expect(userResult._id).toBeDefined()
    expect(userResult.email).toBe(userData.email)
    expect(userResult.name).toBe(userData.name)
    expect(userResult.isDeleted).toBe(false)
  })

  test('Get user with invalid token', async () => {
    const randomId = new mongoose.Types.ObjectId()
    const invalidAuthToken = 'Bearer ' + crypt.createAuthToken(randomId)

    const userResult = await authorizeService.getUserByAuthToken(invalidAuthToken)
    expect(userResult).toBe(null)
  })
})


describe('Get user service test suite', () => {
  connectMongo()
  test('Test get all users service', async () => {
    const userList = await userService.getAllUser()
    userList.forEach((user) => {
      expect(user._id).toBeDefined()
      expect(user.isDeleted).toBe(false)
    })
  })

  test('Test get user by id', async () => {
    const userInstance = await userService.getUserByUserId(testCreatedUser._id)
    expect(userInstance._id).toBeDefined()
    expect(userInstance.email).toBe(testCreatedUser.email)
    expect(userInstance.name).toBe(testCreatedUser.name)
    expect(userInstance.isDeleted).toBe(false)
  })

  test('Test get user by email', async () => {
    const userInstance = await userService.findUserByEmail(testCreatedUser.email)
    expect(userInstance._id).toBeDefined()
    expect(userInstance.email).toBe(testCreatedUser.email)
    expect(userInstance.isDeleted).toBe(false)
  })
})

describe('Authenticate user service test suite', () => {
  connectMongo()

  test('Test authenticate service successfully', async () => {
    const userInstance = await userService.authenticate(userData.email, userData.password)
    expect(userInstance._id).toBeDefined()
    expect(userInstance.email).toBe(testCreatedUser.email)
    expect(userInstance.name).toBe(testCreatedUser.name)
    expect(userInstance.isDeleted).toBe(false)
  })

  test('Test authenticate service fail', async () => {
    const userInstance = await userService.authenticate(testCreatedUser.email, 'najisndijd')
    expect(userInstance).toBe(null)
  })
})

describe('Update user service test suite', () => {
  connectMongo()

  test('Test update user service', async () => {
    testUpdatedUser = await userService.updateUser(testCreatedUser, 'a new email service @gmail.com', 'a new service name')
    expect(testUpdatedUser._id).toBeDefined()
    expect(testUpdatedUser.email).toBe('a new email service @gmail.com')
    expect(testUpdatedUser.name).toBe('a new service name')
    expect(testUpdatedUser.isDeleted).toBe(false)
  })
})

describe('Delete user service test suite', () => {
  connectMongo()

  test('Test delete user service', async () => {
    const userInstance = await userService.deleteUser(testUpdatedUser)
    expect(userInstance._id).toBeDefined()
    expect(userInstance.isDeleted).toBe(true)
  })
})
