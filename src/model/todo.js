import mongoose, { models } from 'mongoose'

const todoSchema = new mongoose.Schema(
  {
    summary: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    isDeleted: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  }
)

const Model = mongoose.model('Todo', todoSchema);

const getById = (id) => Model.findOne({ _id: id, isDeleted: false });

const list = () => Model.find({ isDeleted: false });

const listByUserId = (userId) => Model.find({ user: userId, isDeleted: false });

const createByUserId = async (userId, todoInfo) => {
  const todoInstance = new Model({
    ...todoInfo,
    user: userId
  })

  todoInstance.save((err) => {
    if (err) {
      throw err
    }
  })

  return todoInstance
}

const updateTodo = async (todoInstance, newSummary, newDescription) => {
  todoInstance.summary = newSummary
  todoInstance.description = newDescription
  todoInstance.updatedAt = new Date()

  todoInstance.save((err) => {
    if (err) {
      throw err
    }
  })
  return todoInstance
}

const deleteTodo = async (todoInstance) => {
  todoInstance.isDeleted = true
  todoInstance.updatedAt = new Date()

  todoInstance.save((err) => {
    if (err) {
      throw err
    }
  })
  return todoInstance
}

export default {
  Model,
  getById,
  list,
  listByUserId,
  createByUserId,
  updateTodo,
  deleteTodo,
  schema: todoSchema
};
