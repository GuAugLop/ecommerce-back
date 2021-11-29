const express = require('express');
const PORT = 3333
const cors = require('cors');
const userController = require('./src/controllers/user');
const productController = require('./src/controllers/product');
const app = express()
require("./src/dbconfig/index")

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}))


//Routes
app.use("/u", userController)

app.use("/p", productController)

app.listen(PORT, () => {
  console.log("server is running in port: " + PORT)
})