import todoModel from '../../src/model/todo'
import userModel from '../../src/model/user'
import mongoose from 'mongoose'
import config from '../../src/config/index'

const userData = {
  email: 'testemail@gmail.com',
  name: 'test name',
  password: '123456789',
  isDeleted: false,
  createdAt: new Date(),
  updatedAt: new Date()
}

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

const todoData = {
  summary: 'a test summary',
  description: 'a test description',
  isDeleted: false,
  createdAt: new Date(),
  updatedAt: new Date()
}

let userInstance
let testCreatedTodo
// let testUpdatedTodo
// let testDeletedTodo

describe('Create todo by user id test suite', () => {
  connectMongo()

  test('Test create todo basically', async () => {
    userInstance = await userModel.create(userData)
    testCreatedTodo = await todoModel.createByUserId(userInstance._id, todoData)
    expect(testCreatedTodo._id).toBeDefined()
    expect(testCreatedTodo.summary).toBe(todoData.summary)
    expect(testCreatedTodo.description).toBe(todoData.description)
    expect(testCreatedTodo.user).toBe(userInstance._id)
    expect(testCreatedTodo.isDeleted).toBe(false)
    expect(testCreatedTodo.createdAt).toBe(todoData.createdAt)
    expect(testCreatedTodo.updatedAt).toBe(todoData.updatedAt)
  })

  test('Test create todo with undefined fields', async () => {
    const todoWithInvalidField = await todoModel.createByUserId(userInstance._id, {
      summary: 'a second test summary',
      description: 'a second test description',
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    expect(todoWithInvalidField._id).toBeDefined()
    expect(todoWithInvalidField.nickname).toBeUndefined()
  })

})
