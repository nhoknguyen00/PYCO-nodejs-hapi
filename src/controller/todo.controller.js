import * as todoService from '../service/todo.service'
import Boom from 'boom'

export const getTodoByTodoId = async (request, h) => {
  const { todoId } = request.params

  const todoInstance = await todoService.getTodoByTodoId(todoId)
  
  if (todoInstance) {
    return todoInstance
  }

  return Boom.badRequest(`Todo with id ${todoId} is not existed`)
}

export const getAllTodo = async (request, h) => {
  return await todoService.getAllTodo();
}

export const createTodo = async (request, h) => {
  const { userId, summary, description } = request.payload
  return await todoService.createTodo(userId, summary, description)
}

export const updateTodoByTodoId = async (request, h) => {
  const { todoId } = request.params

  const todoInstance = await todoService.getTodoByTodoId(todoId)
  
  if (todoInstance) {
    const { summary, description } = request.payload;

    return await todoService.updateTodo(todoInstance, summary, description)
  }

  return Boom.badRequest(`Todo with id ${todoId} is not existed`)
}

export const deleteTodoByTodoId = async (request, h) => {
  const { todoId } = request.params

  const todoInstance = await todoService.getTodoByTodoId(todoId)
  
  if (todoInstance) {
    return await todoService.deleteTodo(todoInstance)
  }

  return Boom.badRequest(`Todo with id ${todoId} is not existed`)
}
