import { Request, Response, NextFunction } from 'express';
import {
  createNotificationService,
  editNotificationService,
  findAllNotificationService,
} from '../services/noti.services';

const findAllNotifications = async (req: Request, res: Response, next: NextFunction) => {
  await findAllNotificationService(req, res, next);
};

const createNotification = async (req: Request, res: any, next: NextFunction) => {
  await createNotificationService(req, res, next);
};

const editNotification = async (req: Request, res: any, next: NextFunction) => {
  await editNotificationService(req, res, next);
};

export { findAllNotifications, createNotification, editNotification };
