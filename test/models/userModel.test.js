import userModel from '../../src/model/user'
import mongoose from 'mongoose'
import config from '../../src/config/index'

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

const userData = {
  email: 'testemail@gmail.com',
  name: 'test name',
  password: '123456789',
  isDeleted: false,
  createdAt: new Date(),
  updatedAt: new Date()
}

let testCreatedUser
let testUpdatedUser
let testDeletedUser

describe('Create user test suite', () => {
  connectMongo()
  test('Test create user basically', async () => {
    // Object Id should be defined when successfully saved to MongoDB.
    testCreatedUser = await userModel.create(userData)
    expect(testCreatedUser._id).toBeDefined()
    expect(testCreatedUser.email).toBe(userData.email)
    expect(testCreatedUser.name).toBe(userData.name)
    expect(testCreatedUser.password).toBe(userData.password)
    expect(testCreatedUser.isDeleted).toBe(false)
  })

  test('Test create user with undefined fields', async () => {
    const userWithInvalidField = await userModel.create({
      email: 'nguyen@yahoo.com',
      name: 'nguyen luu tuan',
      password: '123456',
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    expect(userWithInvalidField._id).toBeDefined()
    expect(userWithInvalidField.nickname).toBeUndefined()
  })

  test('Test create user without required field', async () => {
    const userWithoutRequiredField = await userModel.create({
      email: 'testemail@gmail.com',
      name: 'test name'
    })
    let err
    try {
      const testCreatedUserWithoutRequiredField = await userWithoutRequiredField.save()
      err = testCreatedUserWithoutRequiredField
    }
    catch (error) {
      err = error
    }
    expect(err).toBeInstanceOf(mongoose.Error)
  })

})

describe('Find user test suite', () => {
  connectMongo()
  test('Test list all user', async () => {
    const userList = await userModel.list()
    userList.forEach((user) => {
      expect(user._id).toBeDefined()
      expect(user.isDeleted).toBe(false)
    })
  })

  test('Test find user by id', async () => {
    const userInstance = await userModel.findById(testCreatedUser._id)
    expect(userInstance._id).toBeDefined()
    expect(userInstance.email).toBe(testCreatedUser.email)
    expect(userInstance.name).toBe(testCreatedUser.name)
    expect(userInstance.isDeleted).toBe(false)
  })

  test('Test find user with undefined id', async () => {
    const randomUUID = new mongoose.Types.ObjectId()
    const userInstance = await userModel.findById(randomUUID)
    expect(userInstance).toEqual(null)
  })

  test('Test find user by email', async () => {
    const userInstance = await userModel.findByEmail(testCreatedUser.email)
    expect(userInstance._id).toBeDefined()
    expect(userInstance.email).toBe(testCreatedUser.email)
    expect(userInstance.name).toBe(testCreatedUser.name)
    expect(userInstance.isDeleted).toBe(false)
  })

  test('Test find user with undefined email', async () => {
    const userInstance = await userModel.findByEmail('aDefinitelyDumpEmail@gmail.com')
    expect(userInstance).toEqual(null)
  })

})

describe('Update user test suite', () => {
  connectMongo()
  test('Test update user', async () => {
    testUpdatedUser = await userModel.updateUser(testCreatedUser, 'newEmail@gmail.com', 'a new name')
    expect(testUpdatedUser._id).toBeDefined()
    expect(testUpdatedUser.email).toBe('newEmail@gmail.com')
    expect(testUpdatedUser.name).toBe('a new name')
    expect(testUpdatedUser.isDeleted).toBe(testCreatedUser.isDeleted)
  })

})

describe('Delete user test suite', () => {
  connectMongo()
  test('Test delete user', async () => {
    testDeletedUser = await userModel.deleteUser(testUpdatedUser)
    expect(testDeletedUser._id).toBeDefined()
    expect(testDeletedUser.email).toBe(testUpdatedUser.email)
    expect(testDeletedUser.name).toBe(testUpdatedUser.name)
    expect(testDeletedUser.isDeleted).toBe(true)
  })
})
