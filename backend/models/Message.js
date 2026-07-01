import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: [true, 'Message content is required'],
      trim: true,
      maxlength: [1000, 'Message cannot exceed 1000 characters'],
    },
    type: {
      type: String,
      enum: ['text', 'system', 'announcement'],
      default: 'text',
    },
    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

messageSchema.index({ trip: 1, createdAt: -1 });

const Message = mongoose.model('Message', messageSchema);
export default Message;
