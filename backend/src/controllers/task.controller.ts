import { Request, Response, NextFunction } from 'express';
import {
  findAllTaskService,
  findTaskService,
  updateTaskService,
  createTaskService,
} from '../services/task.services';

const findAllTask = async (req: Request, res: Response, next: NextFunction) => {
  await findAllTaskService(req, res, next);
};

const findTask = async (req: Request, res: Response, next: NextFunction) => {
  await findTaskService(req, res, next);
};

const createTask = async (req: Request, res: Response, next: NextFunction) => {
  await createTaskService(req, res, next);
};

const updateTask = async (req: Request, res: Response, next: NextFunction) => {
  await updateTaskService(req, res, next);
};

export { findAllTask, findTask, createTask, updateTask };
