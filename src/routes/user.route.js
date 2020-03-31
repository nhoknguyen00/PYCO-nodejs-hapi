import * as userController from '../controller/user.controller'
import basicResponse from './../response'

const userRoute = [
  {
    method: 'POST',
    path: '/user',
    config: {
      tags: ['api'],
      description: 'register user',
      plugins: {
        'hapi-swagger': {
          responses: basicResponse
        }
      }
    },
    handler: userController.registerUser
  },
  {
    method: 'POST',
    path: '/user/login',
    config: {
      tags: ['api'],
      description: 'login user',
      plugins: {
        'hapi-swagger': {
          responses: basicResponse
        }
      }
    },
    handler: userController.loginUser
  }
]

export default userRoute
