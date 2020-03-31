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
  }
]

export default userRoute
