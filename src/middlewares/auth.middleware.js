import HttpStatus from 'http-status-codes';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const userAuth = async (req, res, next) => {
  try {
    let bearerToken = req.header('Authorization');
    if (!bearerToken)
      throw {
        code: HttpStatus.BAD_REQUEST,
        message: 'Authorization token is required'
      };
    bearerToken = bearerToken.split(' ')[1];
    res.locals.user = await jwt.verify(bearerToken, process.env.SECRET);
    res.locals.token = bearerToken;
    next();
  } catch (error) {
    next(error);
  }
};
