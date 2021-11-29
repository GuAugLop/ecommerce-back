const mongoose = require('../index');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  cpf: {
    type: Number,
  },
  cnpj: {
    type: Number,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  forgot: {
    type: String,
    default: null,
    select: false,
  },
  type: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre('save', async function () {
  try {
    if (this.password) {
      const hash = await bcrypt.hashSync(this.password, 10);
      this.password = hash;
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = mongoose.model('users', userSchema);
