import mongoose, { Schema } from 'mongoose';

const TaskSchema = new mongoose.Schema(
  {
    project: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'project',
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    employee: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'employee',
    },
    estimateHour: {
      type: Number,
      required: true,
    },
    estimateStartDate: {
      type: String,
      default: null,
    },
    estimateEndDate: {
      type: String,
      default: null,
    },
    status: {
      type: Number,
      required: true,
      default: 0,
    },
    actualHour: {
      type: Number,
      default: null,
    },
    actualStartDate: {
      type: String,
      default: null,
    },
    actualEndDate: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model('task', TaskSchema);
export default Task;
