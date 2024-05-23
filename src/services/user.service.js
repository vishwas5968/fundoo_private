import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { sendEmail } from '../utils/user.util';
import { getNotesById } from './notes.service.js';
import { setAllNotes } from '../utils/redis.js';

//create new user
export const registerUser = async (body) => {
  return await User.create(body);
};

export const getUserByEmail = (email) => {
  return User.find({ email: email });
};

export const login = async (req) => {
  const data = await User.findOne({ email: req.body.email });
  await setAllNotes(data._id, await getNotesById(data._id));
  if (data) {
    const match = await bcrypt.compare(req.body.password, data.password);
    return {
      data,
      isMatch: match
    };
  } else {
    throw new Error();
  }
};

export const forgotPassword = async (email) => {
  const data = await User.find({ email: email });
  if (data.length) {
    await sendEmail(email);
  }
};

export const resetPassword = async (email, password) => {
  const data = await User.findOne({ email: email });
  if (data !== null) {
    data.password = await bcrypt.hash(password, 5);
    return User.findOneAndUpdate({ email: email }, data, { new: true });
  }
  throw new Error('Unauthorized Request');
};
