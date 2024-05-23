import HttpStatus from 'http-status-codes';
import * as UserService from '../services/user.service';
const bcrypt = require('bcryptjs');
import { generateJwt } from '../utils/user.util.js';
import { producerInit } from '../kafka/producer.js';
import { consumerInit } from '../kafka/consumer.js';

export const registerUser = async (req, res, next) => {
  const data = await UserService.getUserByEmail(req.body.email);
  req.body.password = await bcrypt.hash(req.body.password, 5);
  try {
    if (data.length === 0) {
      const data = await UserService.registerUser(req.body);
      await producerInit(req)
      consumerInit()
    .then(data => {
      console.log('Received data:', data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
      res.status(HttpStatus.CREATED).json({
        success: true,
        message: 'User created successfully',
        data: data
      });
    } else {
      res.status(HttpStatus.BAD_REQUEST).json({
        code: HttpStatus.BAD_REQUEST,
        message: 'User with this email is already present'
      });
    }
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const data = await UserService.login(req, res, next);
    if (data.isMatch) {
      const token = generateJwt(data.data._id, req.body.email);
      res.cookie('at', token);
      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        message: 'Congratulations! Login Successful',
        data: {
          ...data,
          token: token
        }
      });
    } else {
      res.status(HttpStatus.BAD_REQUEST).json({
        code: HttpStatus.BAD_REQUEST,
        message: `Error! Wrong Password`
      });
    }
  } catch (e) {
    console.log(e);
    res.status(HttpStatus.BAD_REQUEST).json({
      code: HttpStatus.BAD_REQUEST,
      message: `Error! Register with email first`
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const data = await UserService.forgotPassword(req.body.email);
    const token = generateJwt(null, req.body.email);
    res.cookie('at', token);
    res.status(200).json({
      success: true,
      message: `Click on the below link to reset password ${data}`,
      data: 'http://localhost:3000/api/v1/users/reset-password'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Bad request',
      data: `${error}`
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const data = await UserService.resetPassword(
      res.locals.user.email,
      req.body.password
    );
    if (data !== null) {
      res.status(200).json({
        success: true,
        message: 'Password updated successfully',
        data: `${data}`
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Bad request',
      data: `${error}`
    });
  }
};
