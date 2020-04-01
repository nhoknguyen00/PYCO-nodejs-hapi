import * as todoController from '../controller/todo.controller'
import basicResponse from './../response'

const todoRoute = [
  {
    method: 'GET',
    path: '/todo/{todoId}',
    config: {
      tags: ['api'],
      description: 'get todo list by todoId',
      plugins: {
        'hapi-swagger': {
          responses: basicResponse
        }
      }
    },
    handler: todoController.getTodoByTodoId
  },
  {
    method: 'GET',
    path: '/todo',
    config: {
      tags: ['api'],
      description: 'get all todo',
      plugins: {
        'hapi-swagger': {
          responses: basicResponse
        }
      }
    },
    handler: todoController.getAllTodo
  },
  {
    method: 'POST',
    path: '/todo',
    config: {
      tags: ['api'],
      description: 'create todo by userId',
      plugins: {
        'hapi-swagger': {
          responses: basicResponse
        }
      }
    },
    handler: todoController.createTodo
  },
  {
    method: 'PUT',
    path: '/todo/{todoId}',
    config: {
      tags: ['api'],
      description: 'update todo by todoId',
      plugins: {
        'hapi-swagger': {
          responses: basicResponse
        }
      }
    },
    handler: todoController.updateTodoByTodoId
  },
  {
    method: 'DELETE',
    path: '/todo/{todoId}',
    config: {
      tags: ['api'],
      description: 'delete todo by todoId',
      plugins: {
        'hapi-swagger': {
          responses: basicResponse
        }
      }
    },
    handler: todoController.deleteTodoByTodoId
  }
]

export default todoRoute
