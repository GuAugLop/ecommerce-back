const jwt = require('../config/jwt');
const userModel = require('../dbconfig/Schemas/user');

module.exports = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res
        .status(401)
        .send({ err: 'No_Token_Provider', msg: 'Token not found' });
    }
    
    const [bearer, token] = req.headers.authorization.split(' ');
    if (bearer !== 'Bearer') {
      return res
        .status(401)
        .send({ err: 'Invalid_Token', msg: 'Invalid token' });
    }

    if (!token) {
      return res
        .status(401)
        .send({ err: 'No_Token_Provider', msg: 'Token not found' });
    }

    const decoded = await jwt.verify(token);

    if (!decoded) {
      return res
        .status(401)
        .send({ err: 'Invalid_Token', msg: 'Invalid token' });
    }
    const user = await userModel.findById(decoded.data._id);

    if (!user) {
      return res
        .status(401)
        .send({ err: 'Invalid_Token', msg: 'Token Inválido' });
    }

    req.user = user;

    next();
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ err: 'internal_error', msg: 'Falha ao processar a requisição.' });
  }
};
