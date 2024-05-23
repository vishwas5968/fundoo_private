import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../src/index';

describe('User APIs Test', () => {
  let resetToken, loginToken, noteId;

  beforeAll(async () => {
    const clearCollections = async () => {
      for (const collection in mongoose.connection.collections) {
        await mongoose.connection.collections[collection].deleteOne();
      }
    };

    const mongooseConnect = async () => {
      await mongoose.connect(process.env.DATABASE_TEST, {
        useNewUrlParser: true
      });
      await clearCollections();
    };

    if (mongoose.connection.readyState === 0) {
      await mongooseConnect();
    } else {
      await clearCollections();
    }
  });

  describe('New User', () => {
    it('Should return user object', async () => {
      const res = await request(app).post('/api/v1/users').send({
        firstName: 'Vishwas',
        lastName: 'Ramesh',
        email: 'vishwasr968@email.com',
        password: 'Vishwas@123'
      });
      expect(res.statusCode).toBe(201);
      expect(res.body.data).toBeInstanceOf(Object);
    });
  });

  describe('Login User', () => {
    it('Should return token', async () => {
      const res = await request(app).post('/api/v1/users/login').send({
        email: 'vishwasr968@email.com',
        password: 'Vishwas@123'
      });
      loginToken = res.body.data.token;
      expect(res.statusCode).toBe(200);
    });
  });

  //Notes
  describe('Creates new Note', () => {
    it('Should be logged in to create new note', async () => {
      const res = await request(app)
        .post('/api/v1/notes/')
        .set('Authorization', `Bearer ${loginToken}`)
        .send({
          title: 'Sports',
          description: 'IPL'
        });
      noteId = res.body.data._id;
      expect(res.status).toBe(201);
    });
  });

  // Notes
  describe('Get Notes based on User', () => {
    it('should return all notes', async () => {
      console.log('Get Notes based on User');
      const result = await request(app)
        .get('/api/v1/notes/')
        .set('Authorization', `Bearer ${loginToken}`);
      expect(result.status).toBe(200);
    });
  });

  // Notes
  describe('Soft Delete Note', () => {
    it('Should take id', async () => {
      const res = await request(app)
        .put(`/api/v1/notes/trash/${noteId}`)
        .set('Authorization', `Bearer ${loginToken}`);
      expect(res.statusCode).toBe(201);
    });
  });

  // Notes
  describe('Archive Note', () => {
    it('Should take id', async () => {
      const res = await request(app)
        .put(`/api/v1/notes/archive/${noteId}`)
        .set('Authorization', `Bearer ${loginToken}`);
      expect(res.statusCode).toBe(200);
    });
  });

  //Notes
  describe('Update Note', () => {
    it('Should take id', async () => {
      const res = await request(app)
        .put(`/api/v1/notes/${noteId}`)
        .set('Authorization', `Bearer ${loginToken}`)
        .send({
          title: 'Sports',
          description: 'LaLiga'
        });
      expect(res.statusCode).toBe(200);
    });
  });

  // //Notes
  // describe('Delete Note', () => {
  //   it('Should take id', async () => {
  //     const res = await request(app)
  //       .delete('/api/v1/notes/:id')
  //       .set('Authorization',`Bearer ${loginToken}`)
  //       .send({
  //         id:`${noteId}`
  //       });
  //     expect(res.statusCode).toBe(200);
  //   });
  // });
  //
  // describe('Forgot Password', () => {
  //   it('Should send reset mail', async () => {
  //     // console.log(loginToken+"****************")
  //     const res = await request(app)
  //       .post('/api/v1/users/forgot-password')
  //       .send({
  //         email: "vishwasramesh968@email.com"
  //       });
  //     resetToken = res.body.data.token;
  //     expect(res.statusCode).toBe(200);
  //   });
  // });
  //
  // describe('Reset Password', () => {
  //   it('Should reset the password', async () => {
  //     const res = await request(app)
  //       .put('/api/v1/users/reset-password')
  //       .set('Authorization', `Bearer ${resetToken}`)
  //       .send({ password: "Vishwas@234" });
  //     expect(res.statusCode).toBe(200);
  //   });
  // });
});

/*import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../src/index';
import dotenv from 'dotenv';
import { logger } from '../../src/config/winston.js';
import jwt from 'jsonwebtoken';
dotenv.config();

describe('User API', () => {
  let resetToken;
  beforeAll((done) => {
    const clearCollections = () => {
      for (const collection in mongoose.connection.collections) {
        mongoose.connection.collections[collection].deleteOne(() => {});
      }
    };

    const mongooseConnect = async () => {
      await mongoose.connect(process.env.DATABASE_TEST);
      clearCollections();
    };

    if (mongoose.connection.readyState === 0) {
      mongooseConnect();
    } else {
      clearCollections();
    }

    done();
  })

  describe('New User', () => {
    it('Should return user object', async () => {
      const res = await request(app)
        .post('/api/v1/users').send({
          firstName: "Harsh",
          lastName: "Patil",
          email: "harsh@email.com",
          password: "Harsh@123"
        })
      expect(res.status).toBe(201)
      expect(res.body.data._id).toBeDefined()
    });
  });

  describe('Login User', () => {
    it('Should return token', async () => {
      const res = await request(app)
        .post('/api/v1/users/login')
        .send({
          email: "harsh@email.com",
          password: "Cham@234"
        });

      expect(res.statusCode).toBe(200);
    });
  });

  describe('Forgot Password', () => {
    it('Should send reset mail', async () => {
      const res = await request(app)
        .post('/api/v1/users/forgot-password')
        .send({
          email: "harsh@email.com"
        });
      resetToken=res.body.data.token
      expect(res.statusCode).toBe(200);
    });
  });

  describe('Reset Password', () => {
    it('Should reset the password', async () => {
      const res = await request(app)
        .put('/api/v1/users/reset-password')
        .set('Authorization', `Bearer ${resetToken}`)
        .send({_id: '663c3bfe5a19d962888bd5a4', email: 'Nick@gmail.com',password: "Chamm@234" });

      expect(res.statusCode).toBe(200);
    });
  });
});*/
