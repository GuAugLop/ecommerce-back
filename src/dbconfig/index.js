const mongoose = require("mongoose")

mongoose.connect('mongodb+srv://admin:admin@cluster0.qtupv.mongodb.net/tcc?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
module.exports = mongoose