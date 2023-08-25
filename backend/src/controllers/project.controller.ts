import { Request, Response, NextFunction } from 'express';
import {
  findAllProjectService,
  createProjectService,
  updateProjectService,
  findProjectService,
  deleteProjectService,
} from '../services/project.services';

const findAllProject = async (req: Request, res: Response, next: NextFunction) => {
  await findAllProjectService(req, res, next);
};

const findProject = async (req: Request, res: Response, next: NextFunction) => {
  await findProjectService(req, res, next);
};

const createProject = async (req: Request, res: Response, next: NextFunction) => {
  await createProjectService(req, res, next);
};

const updateProject = async (req: Request, res: Response, next: NextFunction) => {
  await updateProjectService(req, res, next);
};

const deleteProject = async (req: Request, res: Response, next: NextFunction) => {
  await deleteProjectService(req, res, next);
};

export { findAllProject, createProject, updateProject, findProject, deleteProject };
