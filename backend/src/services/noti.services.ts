import { Request, Response, NextFunction } from 'express';
import Notification from '../models/notification.model';
import { HTTP_STATUS_CODES } from '../helpers/status';
import { resMessage } from '../helpers/res.message';

const findAllNotificationService = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const result: any = await Notification.find().sort({ createdAt: -1 });
    resMessage(res, HTTP_STATUS_CODES.OK, 'Retrieve all notifications successfully.', result);
  } catch (err: any) {
    next(new Error(`Retrieve all notifications failed: ${err}`));
  }
};

const findNotificationService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result: any = await Notification.findById(req.params.id);
    resMessage(res, HTTP_STATUS_CODES.OK, 'Retrieve single notification successfully.', result);
  } catch (err: any) {
    next(new Error(`Failed retrieve single notification: ${err}`));
  }
};

const createNotificationService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await Notification.insertMany(req.body);
    resMessage(res, HTTP_STATUS_CODES.CREATED, 'Created notifications successfully.', result);
  } catch (err: any) {
    next(new Error(`Failed create notifications: ${err}`));
  }
};

const editNotificationService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const notificationId = req.params.id;
    const updatedNotificationData = { $push: req.body };

    const existingNotification = await Notification.findOne({ _id: notificationId });
    if (!existingNotification) {
      return resMessage(res, HTTP_STATUS_CODES.NOT_FOUND, 'Notification ID does not exist.');
    }

    await Notification.findOneAndUpdate({ _id: existingNotification._id }, updatedNotificationData, {
      new: true,
    });

    resMessage(res, HTTP_STATUS_CODES.OK, 'Notification updated successfully.');
  } catch (err: any) {
    next(new Error(`Failed to update notification: ${err}`));
  }
};

export {
  findAllNotificationService,
  findNotificationService,
  createNotificationService,
  editNotificationService,
};
