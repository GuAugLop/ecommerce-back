const Route = require('express').Router;
const routes = Route();
const productModel = require('../dbconfig/Schemas/product');

const auth = require('../middlewares/auth');

routes.use(auth);

routes.get('/products', async (req, res) => {
  try {
    const products = await productModel.find();
    return res.send(products);
  } catch (err) {
    console.log(err);
  }
});

routes.post('/products', async (req, res) => {
  try {
    if (req.user.type !== 'provider') {
      return res
        .status(401)
        .send({
          err: 'user_is_not_provider',
          errMessage: 'User must be provider',
        });
    }

    const required = ['name', 'price'];
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

    const product = await productModel.create({...body, provider: req.user._id})
    return res.status(201).send({product})

  } catch (err) {
    console.log(err);
    res.status(500).send({ err: 'server_error', errMessage: 'Server Error' });
  }
});

module.exports = routes;
