import { Request, Response, NextFunction } from 'express';
import {
  createEmployeeService,
  deleteEmployeeService,
  findAllEmployeeService,
  findEmployeeService,
  updateEmployeeService,
} from '../services/employee.services';

const findAllEmployee = async (req: Request, res: Response, next: NextFunction) => {
  await findAllEmployeeService(req, res, next);
};

const findEmployee = async (req: Request, res: Response, next: NextFunction) => {
  await findEmployeeService(req, res, next);
};

const createEmployee = async (req: Request, res: any, next: NextFunction) => {
  await createEmployeeService(req, res, next);
};

const updateEmployee = async (req: Request, res: any, next: NextFunction) => {
  await updateEmployeeService(req, res, next);
};

const deleteEmployee = async (req: Request, res: any, next: NextFunction) => {
  await deleteEmployeeService(req, res, next);
};

export { findAllEmployee, findEmployee, createEmployee, updateEmployee, deleteEmployee };
