const mongoose = require('mongoose');

const CollectionNameSchema = new mongoose.Schema(
  {
    name: {
      type: Object,
      required: true,
      unique: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    collection: 'CollectionName'
  }
);

const model = mongoose.model('CollectionName', CollectionNameSchema);

const list = () => model.find();

const create = CollectionName => model.create(CollectionName);

const findByName = name => model.findOne({ name });

const deleteById = id => model.findByIdAndDelete(mongoose.Types.ObjectId(id));

module.exports = {
  model,
  list,
  create,
  findByName,
  deleteById,
  schema: CollectionNameSchema
};
