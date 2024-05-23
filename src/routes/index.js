import express from 'express';
const router = express.Router();

import userRoute from './user.route';
import notesRoute from './notes.route.js';

const routes = () => {
  router.get('/', (req, res) => {
    res.json('Welcome');
  });
  router.use('/users', userRoute);
  router.use('/notes', notesRoute);
  return router;
};

export default routes;
