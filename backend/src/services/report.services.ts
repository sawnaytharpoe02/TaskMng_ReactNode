import { Request, Response, NextFunction } from 'express';
import Report from '../models/report.model';
import { IReport } from '../helpers/interfaces';
import { resMessage } from '../helpers/res.message';
import { HTTP_STATUS_CODES } from '../helpers/status';

const findAllReportService = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const reports = await Report.find()
      .populate([{ path: 'task', select: 'title', populate: { path: 'project', select: 'projectName' } }])
      .sort({ createdAt: -1 });

    resMessage(res, HTTP_STATUS_CODES.OK, 'Retrieve all reports successfully.', reports);
  } catch (err: any) {
    next(new Error(`Failed to retrieve all reports: ${err}`));
  }
};

const createReportService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await Report.insertMany(req.body);
    resMessage(res, HTTP_STATUS_CODES.CREATED, 'Created report successfully.', result);
  } catch (err: any) {
    next(new Error(`Failed create report: ${err}`));
  }
};

const findReportService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const report = await Report.findById(req.params.id).populate([
      { path: 'task', select: 'title', populate: { path: 'project', select: 'projectName' } },
    ]);
    if (!report) {
      resMessage(
        res,
        HTTP_STATUS_CODES.NOT_FOUND,
        `There is no report with this ${req.params.id} id to retrieve!`,
        null
      );
      return;
    }

    resMessage(res, HTTP_STATUS_CODES.OK, 'Retrieve report successfully.', report);
  } catch (err: any) {
    next(new Error(`Failed retrieve report: ${err}`));
  }
};

const deleteReportService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      resMessage(
        res,
        HTTP_STATUS_CODES.NOT_FOUND,
        `There is no report with this ${req.params.id} id to delete!`,
        null
      );
      return;
    }

    await Report.findByIdAndDelete(report?._id);
    resMessage(res, HTTP_STATUS_CODES.OK, 'Deleted report successfully.');
  } catch (err: any) {
    next(new Error(`Failed delete report: ${err}`));
  }
};

export { findAllReportService, findReportService, createReportService, deleteReportService };
