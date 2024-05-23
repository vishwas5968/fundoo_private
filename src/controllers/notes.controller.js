import HttpStatus from 'http-status-codes';
import * as NotesService from '../services/notes.service.js';

export const createNotes = async (req, res) => {
  try {
    req.body.createdBy = res.locals.user.id;
    const data = await NotesService.createNotes(req.body);
    res.status(HttpStatus.CREATED).json({
      success: true,
      message: 'Note created successfully',
      data: data
    });
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({
      code: HttpStatus.BAD_REQUEST,
      message: `${error}`
    });
  }
};

export const getNotesById = async (req, res) => {
  try {
    console.log(res.locals.user.id);
    let data = await NotesService.getNotesById(res.locals.user.id);
    res.status(HttpStatus.OK).json({
      success: true,
      message: 'fetched successfully',
      data: data
    });
  } catch (error) {
    res.status(HttpStatus.OK).json({
      success: false,
      message: `${error}`
    });
  }
};

export const updateNote = async (req, res) => {
  try {
    const data = await NotesService.updateNote(
      req.params.id,
      req.body,
      res.locals.user.email
    );
    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Note Updated Successfully',
      data: data
    });
    // enableCache(req)
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      message: `${error}`
    });
  }
};

export const deleteNote = async (req, res) => {
  try {
    await NotesService.deleteNote(req.params._id, res.locals.user.email);
    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Note Deleted Successfully'
    });
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      message: `${error}`
    });
  }
};

export const softDeleteNote = async (req, res) => {
  try {
    const data = await NotesService.softDeleteNote(req.params.id);
    res.status(HttpStatus.CREATED).json({
      success: true,
      message: 'Note Deleted successfully',
      data: data
    });
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      message: `${error}`
    });
  }
};

export const archiveNote = async (req, res) => {
  try {
    const data = await NotesService.archiveNote(req.params.id);
    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Note Archived successfully',
      data: data
    });
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      message: `${error}`
    });
  }
};
