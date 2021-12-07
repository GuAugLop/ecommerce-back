const Route = require('express').Router;
const routes = Route();
const productModel = require('../dbconfig/Schemas/product');
const mongoose = require('mongoose');

const auth = require('../middlewares/auth');

routes.use(auth);

routes.get('/products', async (req, res) => {
  try {
    const products = await productModel.find().populate([{path: "provider"}]);
    return res.send(products);
  } catch (err) {
    console.log(err);
    res.status(500).send({ err: 'server_error', errMessage: 'Server Error' });
  }
});

routes.post('/products', async (req, res) => {
  try {
    if (req.user.type !== 'provider') {
      return res.status(401).send({
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

    const product = await productModel.create({
      ...body,
      provider: req.user._id,
    });
    return res.status(201).send({ product });
  } catch (err) {
    console.log(err);
    res.status(500).send({ err: 'server_error', errMessage: 'Server Error' });
  }
});

routes.delete('/products/:id', async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res
      .status(403)
      .send({ err: 'invalid_id', errMessage: 'ID is not a Mongo ObjectID' });
  }
  try {
    const product = await productModel.findById(id);
    if (!product) {
      return res
        .status(404)
        .send({ err: 'object_not_found', errMessage: 'Object not found' });
    }

    if(String(product.provider) !== String(req.user._id)){
      return res.status(401).send({err: "the_product_is_not_yours", errMessage: "You must be provider of this product"})
    }

    await product.remove()

    res.status(200).send();
  } catch (err) {
    console.log(err);
    res.status(500).send({ err: 'server_error', errMessage: 'Server Error' });
  }
});

routes.get('/me', async (req, res) => {
  const products = await productModel.find({ provider: req.user._id });

  res.send([...products])
});

module.exports = routes;
