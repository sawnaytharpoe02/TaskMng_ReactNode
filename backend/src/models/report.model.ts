import mongoose, { Schema } from 'mongoose';

const ReportSchema = new mongoose.Schema(
  {
    reportTo: {
      type: String,
      required: true,
    },
    task: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'task',
      populate: {
        path: 'project',
        model: 'project',
      },
    },
    projectName: {
      type: String,
    },
    taskTitle: {
      type: String,
    },
    percentage: {
      type: Number,
      required: true,
    },
    types: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: '0',
    },
    hour: {
      type: Number,
      required: true,
    },
    problem_feeling: {
      type: String,
    },
    reportBy: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Report = mongoose.model('report', ReportSchema);
export default Report;
