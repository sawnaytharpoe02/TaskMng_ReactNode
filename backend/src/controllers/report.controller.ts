import { Request, Response, NextFunction } from 'express';
import {
  findAllReportService,
  findReportService,
  createReportService,
  deleteReportService,
} from '../services/report.services';

const findAllReport = async (req: Request, res: Response, next: NextFunction) => {
  await findAllReportService(req, res, next);
};

const findReport = async (req: Request, res: Response, next: NextFunction) => {
  await findReportService(req, res, next);
};

const createReport = async (req: Request, res: any, next: NextFunction) => {
  await createReportService(req, res, next);
};

const deleteReport = async (req: Request, res: any, next: NextFunction) => {
  await deleteReportService(req, res, next);
};

export { findAllReport, findReport, createReport, deleteReport };
