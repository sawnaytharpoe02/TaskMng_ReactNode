import { Request, Response, NextFunction } from 'express';
import Task from '../models/task.model';
import { ITask } from '../helpers/interfaces';
import { HTTP_STATUS_CODES } from '../helpers/status';
import { resMessage } from '../helpers/res.message';

const findAllTaskService = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await Task.find()
      .populate([
        { path: 'project', select: '_id projectName' },
        { path: 'employee', select: '_id employeeName' },
      ])
      .sort({ createdAt: -1 });

    resMessage(res, HTTP_STATUS_CODES.OK, 'Retrieve all tasks successfully.', result);
  } catch (err: any) {
    next(new Error(`Failed retrieve tasks: ${err}`));
  }
};

const findTaskService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = await Task.findById(req.params.id).populate([
      { path: 'project', select: '_id projectName' },
      { path: 'employee', select: '_id employeeName' },
    ]);
    if (!task) next(new Error(`There is no task with this ${req.params.id} id!`));

    resMessage(res, HTTP_STATUS_CODES.OK, 'Retrieve task successfully.', task);
  } catch (err: any) {
    next(new Error(`Failed retrieve task: ${err}`));
  }
};

const createTaskService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result: ITask = await new Task(req.body).save();
    resMessage(res, HTTP_STATUS_CODES.CREATED, 'Created task successfully.', result);
  } catch (err: any) {
    next(new Error(`Failed create task: ${err}`));
  }
};

const updateTaskService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) next(new Error(`There is no task with this ${req.params.id} id to update!`));

    const result = await Task.findByIdAndUpdate(task?._id, req.body, { new: true });
    resMessage(res, HTTP_STATUS_CODES.OK, 'Updated task successfully.', result);
  } catch (err: any) {
    next(new Error(`Failed update task: ${err}`));
  }
};

export { findAllTaskService, findTaskService, createTaskService, updateTaskService };
