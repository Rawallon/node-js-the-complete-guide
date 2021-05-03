const jwt = require('jsonwebtoken');
const { throwError } = require('../controllers/errorHandler');

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    throwError('Couldnt find Authorization', 401);
  }
  const token = authHeader.split(' ')[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, 'secret');
  } catch (error) {
    throwError('', 500);
  }
  if (!decodedToken) {
    throwError('Not auth', 401);
  }
  req.userId = decodedToken.userId;
  next();
};
