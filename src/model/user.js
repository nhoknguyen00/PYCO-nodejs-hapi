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
      default: false,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      required: true
    },
    updatedAt: {
      type: Date,
      default: Date.now,
      required: true
    }
  }
);

userSchema.methods.validPassword = function (password) {
  return crypt.comparePassword(password, this.password)
}

const Model = mongoose.model('User', userSchema);

const list = async () => await Model.find({ isDeleted: false });

const findById = async (userId) => await Model.findOne({
  _id: userId,
  isDeleted: false
});

const create = async (userInfo) => {
  userInfo.password = crypt.hashPassword(userInfo.password)

  const userInstance = new Model({
    _id: new mongoose.Types.ObjectId(),
    ...userInfo
  })

  await userInstance.save((err) => {
    if (err) {
      throw err
    }
  })

  return userInstance
};

const findByEmail = async (email) => await Model.findOne({ email, isDeleted: false });

const updateUser = async (userInstance, newEmail, newName) => {
  userInstance.email = newEmail
  userInstance.name = newName
  userInstance.updatedAt = new Date()

  await userInstance.save((err) => {
    if (err) {
      return err
    }
  })

  return userInstance
}

const deleteUser = async (userInstance) => {
  userInstance.isDeleted = true
  userInstance.updatedAt = new Date()

  await userInstance.save((err) => {
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
