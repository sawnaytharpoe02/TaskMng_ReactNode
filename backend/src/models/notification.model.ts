import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema(
  {
    tag: {
      type: String,
    },
    createdByWhom: {
      type: String,
    },
    message: {
      type: String,
    },
    profile: {
      type: String,
    },
    read: {
      type: Array,
      default: [],
    },
    sendTo: {
      type: String,
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model('notification', NotificationSchema);
export default Notification;
