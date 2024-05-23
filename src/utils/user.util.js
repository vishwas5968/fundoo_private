import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import logger from '../config/logger.js';
import HttpStatus from 'http-status-codes';
dotenv.config();
const Redis = require('ioredis');

export function generateJwt(id, email) {
  const payload = {
    id,
    email
  };
  return jwt.sign(payload, process.env.SECRET);
}

export async function sendEmail(email) {
  const OAuth2 = google.auth.OAuth2;
  const Oauth_client = new OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET
  );
  Oauth_client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
  const accessToken = Oauth_client.getAccessToken();
  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    port: 587,
    secure: false,
    auth: {
      type: 'OAuth2',
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
      accessToken: accessToken
    },
    debug: true
  });
  let msg = {
    from: 'v14052000@gmail.com',
    to: `${email}`,
    subject: 'Hello',
    text: 'Hello World',
    html: '<a href=http://localhost:3000/api/v1/users/">Click here to register </a>'
  };
  transporter.sendMail(msg, (err, result) => {
    if (err) throw new Error(err);
  });
}

export const enableCache = (email, userNotes) => {
  const redis = new Redis();
  try {
    redis.set(email, userNotes);
    return redis.get(email, (err, result) => {
      if (err) {
        return null;
      } else {
        console.log(result); // Prints "value"
      }
    });
  } catch (e) {
    logger.error(e);
  }
};

export const getDataFromCache = (req, res) => {
  const redis = new Redis();
  try {
    let token = req.header('Authorization');
    token = token.split(' ')[1];
    const userInfo = jwt.verify(token, process.env['SECRET ']);
    const data = redis.get(userInfo.email, (err, result) => {
      if (err) {
        return null;
      } else {
        console.log(result); // Prints "value"
      }
    });
    res.status(HttpStatus.OK).json({
      success: true,
      message: 'fetched successfully',
      data: data
    });
  } catch (e) {
    logger.error(e);
  }
};
