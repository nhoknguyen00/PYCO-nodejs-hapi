import todoModel from '../../src/model/todo'
import userModel from '../../src/model/user'
import mongoose from 'mongoose'
import connectMongo from '../connectMongo'

const userData = {
  email: 'testemail@gmail.com',
  name: 'test name',
  password: '123456789',
  isDeleted: false,
  createdAt: new Date(),
  updatedAt: new Date()
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
let testUpdatedTodo
let testDeletedTodo

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

describe('Find todo test suite', () => {
  connectMongo()
  test('Test list all todos', async () => {
    const todoList = await todoModel.list()
    todoList.forEach((todo) => {
      expect(todo._id).toBeDefined()
      expect(todo.isDeleted).toBe(false)
    })
  })

  test('Test list all todos of user', async () => {
    const todoList = await todoModel.listByUserId(userInstance._id)
    todoList.forEach((todo) => {
      expect(todo._id).toBeDefined()
      expect(todo.user).toStrictEqual(userInstance._id)
      expect(todo.isDeleted).toBe(false)
    })
  })

  test('Test find todo of user by id', async () => {
    const todoInstance = await todoModel.getTodoOfUserById(testCreatedTodo._id, userInstance._id)
    expect(todoInstance._id).toBeDefined()
    expect(todoInstance.summary).toBe(testCreatedTodo.summary)
    expect(todoInstance.description).toBe(testCreatedTodo.description)
    expect(todoInstance.user).toStrictEqual(testCreatedTodo.user)
    expect(todoInstance.isDeleted).toBe(false)
  })

  test('Test find todo with undefined id', async () => {
    const randomUUID = new mongoose.Types.ObjectId()
    const todoInstance = await todoModel.getTodoOfUserById(randomUUID, userInstance._id)
    expect(todoInstance).toEqual(null)
  })

})

describe('Update todo test suite', () => {
  connectMongo()
  test('Test update todo', async () => {
    testUpdatedTodo = await todoModel.updateTodo(testCreatedTodo, 'test update summary', 'test update desciption')
    expect(testUpdatedTodo._id).toBeDefined()
    expect(testUpdatedTodo.summary).toBe('test update summary')
    expect(testUpdatedTodo.description).toBe('test update desciption')
    expect(testUpdatedTodo.isDeleted).toBe(false)
  })

})

describe('Delete todo test suite', () => {
  connectMongo()
  test('Test delete todo', async () => {
    testDeletedTodo = await todoModel.deleteTodo(testUpdatedTodo)
    expect(testDeletedTodo._id).toBeDefined()
    expect(testDeletedTodo.summary).toBe(testUpdatedTodo.summary)
    expect(testDeletedTodo.description).toBe(testUpdatedTodo.description)
    expect(testDeletedTodo.isDeleted).toBe(true)
  })
})
