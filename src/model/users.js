import mongoose from 'mongoose'
import crypt from '../utils/crypt.utils'

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
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
);

userSchema.methods.validPassword = function (password) {
  return crypt.comparePassword(password, this.password)
}

const Model = mongoose.model('User', userSchema);

const list = () => Model.find({ isDeleted: false });

const findById = (userId) => Model.findOne({ _id: userId, isDeleted: false });

const create = async (userInfo) => {
  userInfo.password = crypt.hashPassword(userInfo.password)

  const userInstance = new Model({
    _id: new mongoose.Types.ObjectId(),
    ...userInfo
  })
  userInstance.save((err) => {
    if (err) {
      throw err
    }
  })

  return userInstance
};

const findByEmail = email => Model.findOne({ email, isDeleted: false });

const updateUser = (userInstance, newEmail, newName) => {
  userInstance.email = newEmail
  userInstance.name = newName
  userInstance.updatedAt = new Date()

  userInstance.save((err) => {
    if (err) {
      return err
    }
  })

  return userInstance
}

const deleteUser = (userInstance) => {
  userInstance.isDeleted = true
  userInstance.updatedAt = new Date()

  userInstance.save((err) => {
    if (err) {
      throw err
    }
  })
  return userInstance
}

const deleteAllUsers = async () => {
  return await Model.updateMany({}, { isDeleted: true });
}

export default {
  Model,
  list,
  findById,
  findByEmail,
  create,
  updateUser,
  deleteUser,
  deleteAllUsers,
  schema: userSchema
};
