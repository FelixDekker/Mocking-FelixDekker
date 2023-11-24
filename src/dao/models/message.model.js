import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const messageSchema = new Schema({
  user: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Message = model('Message', messageSchema);

export default Message;
