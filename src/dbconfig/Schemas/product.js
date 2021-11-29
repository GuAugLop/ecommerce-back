const mongoose = require('../index');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    require: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('products', productSchema);
