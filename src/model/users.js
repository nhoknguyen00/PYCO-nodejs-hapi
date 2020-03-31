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

const Model = mongoose.model('users', userSchema);

const list = () => Model.find();

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

const findByEmail = email => Model.findOne({ email });

const deleteById = id => Model.findByIdAndDelete(mongoose.Types.ObjectId(id));

export default {
  Model,
  list,
  create,
  findByEmail,
  deleteById,
  schema: userSchema
};
