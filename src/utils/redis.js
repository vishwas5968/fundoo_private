const Redis = require('ioredis');
const redis = new Redis();

export const getSingleNote = async (userId, noteId) => {
  return redis.get(`note:${userId}:${noteId}`);
};

// Function to trash,set,archive,update single note
export const setSingleNote = async (userId, noteId, data) => {
  await redis.set(`note:${userId}:${noteId}`, JSON.stringify(data));
  // await redis.set(`note:${userId}:${noteId}`,JSON.stringify(data));
};

// Function to set all note
export const setAllNotes = async (userId, notes) => {
  for (const note of notes) {
    await redis.set(`note:${userId}:${note._id}`, JSON.stringify(note));
  }
};

// Function to delete single note
export const deleteSingleNote = async (userId, noteId) => {
  await redis.del(`note:${userId}:${noteId}`);
};

// Function to fetch all notes for a user
export const getAllNotesForUser = async (userId) => {
  try {
    const noteKeys = await redis.keys(`note:${userId}:*`);
    if (!noteKeys.length) {
      return null;
    }
    const notes = await redis.mget(noteKeys);
    for (let i = 0; i < notes.length; i++) {
      notes[i] = JSON.parse(notes[i]);
    }
    return notes;
  } catch (error) {
    throw error;
  }
};

export default redis;
