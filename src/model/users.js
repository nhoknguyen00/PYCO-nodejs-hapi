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

const Model = mongoose.model('Users', userSchema);

const list = () => Model.find();

const create = async (User) => {
  User.password = crypt.hashPassword(User.password)
  const userInstance = new Model({ ...User })
  userInstance.save((err) => {
    if (err) {
      throw err
    }
  })
  return userInstance
};

const findByName = name => Model.findOne({ name });

const deleteById = id => Model.findByIdAndDelete(mongoose.Types.ObjectId(id));

export default {
  Model,
  list,
  create,
  findByName,
  deleteById,
  schema: userSchema
};
