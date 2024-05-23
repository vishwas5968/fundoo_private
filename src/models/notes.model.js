import { model, Schema } from 'mongoose';

const notesSchema = new Schema({
  title: {
    type: String
  },
  description: {
    type: String
  },
  color: {
    type: String,
    default: 'White'
  },
  isArchive: {
    type: Boolean,
    default: false
  },
  isTrashed: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: String
  }
});

export default model('Notes', notesSchema);
