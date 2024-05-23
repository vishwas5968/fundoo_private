import express from 'express';
import { userAuth } from '../middlewares/auth.middleware.js';
import * as NotesController from '../controllers/notes.controller.js';

const router = express.Router();

router.post('/', userAuth, NotesController.createNotes);

router.get('/', userAuth, NotesController.getNotesById);

router.delete('/:id', userAuth, NotesController.deleteNote);

router.put('/:id', userAuth, NotesController.updateNote);

router.put('/trash/:id', userAuth, NotesController.softDeleteNote);

router.put('/archive/:id', userAuth, NotesController.archiveNote);

export default router;
