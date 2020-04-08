import * as todoService from '../../src/service/todo.service'
import * as userService from '../../src/service/user.service'
import mongoose from 'mongoose'
import config from '../../src/config/index'

const userData = {
  email: 'testemailservice@gmail.com',
  name: 'test name service',
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
  summary: 'a test summary service',
  description: 'a test description service',
  isDeleted: false,
  createdAt: new Date(),
  updatedAt: new Date()
}

let userInstance
let testCreatedTodo
let testUpdatedTodo
let testDeletedTodo

describe('Create todo by user id service test suite', () => {
  connectMongo()

  test('Test create todo basically', async () => {
    userInstance = await userService.createUser(userData.email, userData.name, userData.password)
    testCreatedTodo = await todoService.createTodo(userInstance._id, todoData.summary, todoData.description)
    expect(testCreatedTodo._id).toBeDefined()
    expect(testCreatedTodo.summary).toBe(todoData.summary)
    expect(testCreatedTodo.description).toBe(todoData.description)
    expect(testCreatedTodo.user).toBe(userInstance._id)
    expect(testCreatedTodo.isDeleted).toBe(false)
  })
})

describe('Find todo service test suite', () => {
  connectMongo()
  test('Test get all todos', async () => {
    const todoList = await todoService.getAllTodo()
    todoList.forEach((todo) => {
      expect(todo._id).toBeDefined()
      expect(todo.isDeleted).toBe(false)
    })
  })

  test('Test get all todos of user', async () => {
    const todoList = await todoService.getAllTodoByUserId(userInstance._id)
    todoList.forEach((todo) => {
      expect(todo._id).toBeDefined()
      expect(todo.user).toStrictEqual(userInstance._id)
      expect(todo.isDeleted).toBe(false)
    })
  })

  test('Test find todo of user by id', async () => {
    const todoInstance = await todoService.getTodoOfUserByTodoId(testCreatedTodo._id, userInstance._id)
    expect(todoInstance._id).toBeDefined()
    expect(todoInstance.summary).toBe(testCreatedTodo.summary)
    expect(todoInstance.description).toBe(testCreatedTodo.description)
    expect(todoInstance.user).toStrictEqual(testCreatedTodo.user)
    expect(todoInstance.isDeleted).toBe(false)
  })

  test('Test find todo with undefined id', async () => {
    const randomUUID = new mongoose.Types.ObjectId()
    const todoInstance = await todoService.getTodoOfUserByTodoId(randomUUID, userInstance._id)
    expect(todoInstance).toEqual(null)
  })

})

describe('Update todo test suite', () => {
  connectMongo()
  test('Test update todo', async () => {
    testUpdatedTodo = await todoService.updateTodo(testCreatedTodo, 'test update summary', 'test update desciption')
    expect(testUpdatedTodo._id).toBeDefined()
    expect(testUpdatedTodo.summary).toBe('test update summary')
    expect(testUpdatedTodo.description).toBe('test update desciption')
    expect(testUpdatedTodo.isDeleted).toBe(false)
  })

})

describe('Delete todo test suite', () => {
  connectMongo()
  test('Test delete todo', async () => {
    testDeletedTodo = await todoService.deleteTodo(testUpdatedTodo)
    expect(testDeletedTodo._id).toBeDefined()
    expect(testDeletedTodo.summary).toBe(testUpdatedTodo.summary)
    expect(testDeletedTodo.description).toBe(testUpdatedTodo.description)
    expect(testDeletedTodo.isDeleted).toBe(true)
  })
})
