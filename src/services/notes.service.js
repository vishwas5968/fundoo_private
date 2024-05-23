import Notes from '../models/notes.model.js';
import * as Redis from '../utils/redis.js';

export const createNotes = async (body) => {
  const data = await Notes.create(body);
  await Redis.setSingleNote(data.createdBy, data._id, data);
  return data;
};

export const getNotesById = async (id) => {
  const notes = await Redis.getAllNotesForUser(id);
  if (notes) return notes;
  return Notes.find({ createdBy: id });
};

export const updateNote = async (_id, body) => {
  const updatedData = await Notes.findOneAndUpdate(
    {
      _id
    },
    body,
    {
      new: true
    }
  ).then((updatedNote) => {
    if (updatedNote !== null) return updatedNote;
    throw new Error('Unauthorized Request');
  });
  await Redis.setSingleNote(
    updatedData.createdBy,
    updatedData._id,
    updatedData
  );
  return updatedData;
};

export const deleteNote = async (_id, email) => {
  return await Notes.findOneAndDelete({
    _id,
    createdBy: email
  }).then((result) => {
    if (result !== null) return;
    throw new Error('Unauthorized Request');
  });
};

export async function softDeleteNote(id) {
  const oldData = await Notes.findById(id);
  oldData.isTrashed = !oldData.isTrashed;
  const updatedData = await Notes.findByIdAndUpdate(id, oldData, { new: true });
  await Redis.setSingleNote(
    updatedData.createdBy,
    updatedData._id,
    updatedData
  );
  console.log(await Redis.getAllNotesForUser(updatedData.createdBy));
  return updatedData;
}

export async function archiveNote(id) {
  const oldData = await Notes.findById(id);
  oldData.isArchive = !oldData.isArchive;
  const updatedData = await Notes.findByIdAndUpdate(id, oldData, { new: true });
  await Redis.setSingleNote(
    updatedData.createdBy,
    updatedData._id,
    updatedData
  );
  return updatedData;
}
