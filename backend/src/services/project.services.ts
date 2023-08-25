import Project from '../models/project.model';
import { IProject } from '../helpers/interfaces';
import { Request, Response, NextFunction } from 'express-serve-static-core';
import { resMessage } from '../helpers/res.message';
import { HTTP_STATUS_CODES } from '../helpers/status';

const findAllProjectService = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const result: any = await Project.find().sort({ createdAt: -1 });
    resMessage(res, HTTP_STATUS_CODES.OK, 'Retrieve all projects successfully.', result);
  } catch (err: any) {
    next(new Error(`Retrieve all projects failed.: ${err}`));
  }
};

const findProjectService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const project: any = await Project.findById(req.params.id);
    if (!project) {
      resMessage(
        res,
        HTTP_STATUS_CODES.NOT_FOUND,
        `There is no project with this ${req.params.id} id to retrieve!`,
        null
      );
      return;
    }

    resMessage(res, HTTP_STATUS_CODES.OK, 'Retrieve project successfully.', project);
  } catch (err: any) {
    next(new Error(`Failed retrieve project: ${err}`));
  }
};

const createProjectService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectName = await Project.findOne({ projectName: req.body.projectName });
    if (projectName) next(new Error(`Project name is already in used!`));

    const result: IProject = await new Project(req.body).save();
    resMessage(res, HTTP_STATUS_CODES.CREATED, 'Created project successfully.', result);
  } catch (err: any) {
    next(new Error(`Failed create project: ${err}`));
  }
};

const updateProjectService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      resMessage(
        res,
        HTTP_STATUS_CODES.NOT_FOUND,
        `There is no project with this ${req.params.id} id to update!`,
        null
      );
      return;
    }

    const result: any = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    resMessage(res, HTTP_STATUS_CODES.OK, 'Updated project successfully.', result);
  } catch (err: any) {
    next(new Error(`Failed update project: ${err}`));
  }
};

const deleteProjectService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      resMessage(
        res,
        HTTP_STATUS_CODES.NOT_FOUND,
        `There is no project with this ${req.params.id} id to delete!`,
        null
      );
      return;
    }

    const result: any = await Project.findByIdAndDelete(project?._id);
    resMessage(res, HTTP_STATUS_CODES.OK, 'Deleted project successfully.', result);
  } catch (err: any) {
    next(new Error(`Failed delete project: ${err}`));
  }
};

export {
  findAllProjectService,
  createProjectService,
  updateProjectService,
  findProjectService,
  deleteProjectService,
};
