const Route = require('express').Router;
const routes = Route();
const bcrypt = require("bcrypt");
const jwt = require("../config/jwt");

const userModel = require('../dbconfig/Schemas/user');

routes.post('/register', async (req, res) => {
  const required = ['email', 'password', 'name', 'type'];
  const err = [];
  const body = req.body;
  if(body.type === "client"){
    required.push("cpf")
  }
  if(body.type === "provider"){
    required.push("cnpj")
  }

  required.forEach((key) => {
    if (!body[key]) {
      err.push(key);
    }
  });

  if (err.length > 0) {
    return res.status(403).send({
      missingFields: err,
      err: 'fields_missing',
      errMessage: 'some fields are missing',
    });
  }

  try {
    const user = await userModel.findOne({ email: body.email });
    if (user) {
      return res
        .status(401)
        .send({ err: 'emai_in_use', errMessage: 'Email already in use' });
    }

    const register = await userModel.create({ ...body });

    register.password = undefined

    res.status(201).send(register);
  } catch (err) {
    console.log(err);
    res.status(500).send({ err: 'server_error', errMessage: 'Server Error' });
  }
});

routes.post('/login', async (req, res) => {
  const required = ['email', 'password'];
  const err = [];
  const body = req.body;

  required.forEach((key) => {
    if (!body[key]) {
      err.push(key);
    }
  });

  if (err.length > 0) {
    return res.status(403).send({
      missingFields: err,
      err: 'fields_missing',
      errMessage: 'some fields are missing',
    });
  }

  try {
    const user = await userModel.findOne({email: body.email}).select("+password")
    if(!user){
      return res.status(404).send({err: "user_not_found", errMessage: "User not found"})
    }
    const compare = bcrypt.compareSync(body.password, user.password);

    if(!compare){
      return res.status(401).send({err: "invalid_password", errMessage: "Invalid password"})
    }

    const token = await jwt.sign({ data: { _id: user._id } });
    if (!token) {
      return res
        .status(400)
        .send({ err: "failed_generate_token", msg: "Falha ao gerar o token." });
    }

    user.password = undefined

    return res.status(200).send({user, token})
  } catch (err) {
    console.log(err);
    res.status(500).send({ err: 'server_error', errMessage: 'Server Error' });
  }
});

routes.get('/forgot', (req, res) => {
  return res.send('Forgot Client');
});

module.exports = routes;
