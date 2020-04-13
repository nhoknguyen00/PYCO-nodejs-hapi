import * as userController from '../../src/controller/user.controller'
import Boom from 'boom'
import mongoose from 'mongoose'
import crypt from '../../src/utils/crypt.utils'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../../src/config/index'
import connectMongo from '../connectMongo'

const userData = {
  email: 'testemailcontroller@gmail.com',
  name: 'test name controller',
  password: '123456789'
}

let testCreatedUser
let testUpdatedUser

// jest.mock('../../src/service/user.service', () => ({
//   getAllUser: () => Promise.resolve([{
//     _id: '00394bbc-bf8a-4336-b02c-6e3c38f42675',
//     email: 'miketuannguyen@gmail.com',
//     password: '$2a$08$QkJ2SX8hm7UWx65EvCX35eUaAElaFqS7ZC9Q4b3JiFMoFx74UwCIe',
//     isDeleted: false,
//     updatedAt: new Date(),
//     createdAt: new Date()
//   }, {
//     _id: '98c75065-0cb5-4110-8424-1189e51747c2',
//     email: '1612434@gmail.com',
//     password: '$2a$08$QkJ2SX8hm7UWx65EvCX35eUaAElaFqS7ZC9Q4b3JiFMoFx74UwCIe',
//     isDeleted: false,
//     updatedAt: new Date(),
//     createdAt: new Date()
//   }])
// }))

describe('Register user test suite', () => {
  connectMongo()
  test('should return user info after registering', async () => {
    const request = { payload: userData }
    testCreatedUser = await userController.registerUser(request, {})
    expect(testCreatedUser._id).toBeDefined()
    expect(testCreatedUser.email).toBe(userData.email)
    expect(testCreatedUser.name).toBe(userData.name)
    expect(crypt.comparePassword(userData.password, testCreatedUser.password)).toBe(true)
  })
})

describe('Register user test suite', () => {
  connectMongo()
  test('should return used email error cause this email was used', async () => {
    const request = { payload: userData }
    const response = await userController.registerUser(request, {})
    expect(response).toStrictEqual(Boom.badRequest('Email is already in use'))
  })
})

describe('Get user test suite', () => {
  connectMongo()
  test('should return all users with isDeleted == false', async () => {
    const response = await userController.getAllUser({}, {})
    response.forEach((obj) => {
      expect(obj._id).toBeDefined()
      expect(obj.isDeleted).toBe(false)
    })
  })

  test('should return not existed error', async () => {
    const userId = new mongoose.Types.ObjectId()
    const request = { params: { userId: userId } }

    const response = await userController.getUserByUserId(request, {})

    expect(response).toStrictEqual(Boom.badRequest(`User with id ${userId} is not existed`))
  })
})

describe('Get user test suite', () => {
  connectMongo()
  test('should return all users with isDeleted == false', async () => {
    const response = await userController.getAllUser({}, {})
    response.forEach((obj) => {
      expect(obj._id).toBeDefined()
      expect(obj.isDeleted).toBe(false)
    })
  })

  test('should return user', async () => {
    const request = { params: { userId: testCreatedUser._id } }

    const response = await userController.getUserByUserId(request, {})
    
    expect(response._id).toBeDefined()
    expect(response.email).toBe(testCreatedUser.email)
    expect(response.name).toBe(testCreatedUser.name)
    expect(response.isDeleted).toBe(false)
  })
})

describe('Get user test suite', () => {
  connectMongo()
  test('should return not existed error', async () => {
    const userId = new mongoose.Types.ObjectId()
    const request = { params: { userId: userId } }

    const response = await userController.getUserByUserId(request, {})

    expect(response).toStrictEqual(Boom.badRequest(`User with id ${userId} is not existed`))
  })
})

describe('Login user test suite', () => {
  connectMongo()
  test('should return jwt token', async () => {
    const request = { payload: userData }
    const response = await userController.loginUser(request, {})
    expect(response.userInstance._id).toBeDefined()
    expect(response.userInstance.email).toBe(userData.email)
    expect(response.userInstance.name).toBe(userData.name)
    expect(crypt.comparePassword(userData.password, response.userInstance.password)).toBe(true)
    expect(response.token).toBeDefined()
  })

  test('should return invalid email password error', async () => {
    const request = { payload: { email: 'dumpemail@gmail.com', password: '123456' } }
    const response = await userController.loginUser(request, {})
    expect(response).toStrictEqual(Boom.badRequest('Invalid email or password'))
  })
})

describe('Update user test suite', () => {
  connectMongo()
  test('should return user after updating', async () => {
    const request = {
      params: { userId: testCreatedUser._id },
      payload: {
        email: 'testupdatedemailcontroller@gmail.com',
        name: 'test update name controller'
      }
    }

    testUpdatedUser = await userController.updateUserByUserId(request, {})
    expect(testUpdatedUser._id).toBeDefined()
    expect(testUpdatedUser.email).toBe('testupdatedemailcontroller@gmail.com')
    expect(testUpdatedUser.name).toBe('test update name controller')
  })

  test('shoud return not found error', async () => {
    const userId = new mongoose.Types.ObjectId()
    const request = {
      params: { userId: userId },
      payload: {
        email: 'testupdatedemailcontroller@gmail.com',
        name: 'test update name controller'
      }
    }

    const response = await userController.updateUserByUserId(request, {})
    expect(response).toStrictEqual(Boom.badRequest(`User with id ${userId} is not existed`))
  })
})

describe('Delete user test suite', () => {
  connectMongo()
  test('should return user after deleting', async () => {
    const request = { params: { userId: testUpdatedUser._id } }

    const response = await userController.deleteUserByUserId(request, {})
    expect(response._id).toBeDefined()
    expect(response.email).toBe(testUpdatedUser.email)
    expect(response.name).toBe(testUpdatedUser.name)
    expect(response.isDeleted).toBe(true)
  })

  test('shoud return not found error', async () => {
    const userId = new mongoose.Types.ObjectId()
    const request = { params: { userId: userId } }

    const response = await userController.deleteUserByUserId(request, {})
    expect(response).toStrictEqual(Boom.badRequest(`User with id ${userId} is not existed`))
  })
})
