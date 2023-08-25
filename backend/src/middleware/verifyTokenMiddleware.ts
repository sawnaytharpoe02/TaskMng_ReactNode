import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { resMessage } from '../helpers/res.message';
import { HTTP_STATUS_CODES } from '../helpers/status';
import Employee from '../models/employee.model';

const verifyTokenMiddleware = async (req: any, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return resMessage(res, HTTP_STATUS_CODES.UNAUTHORIZED, 'Authorization token not provided.', null);
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as { _id: string };

    const employee = await Employee.findById(decodedToken._id);
    if (!employee) {
      return resMessage(res, HTTP_STATUS_CODES.UNAUTHORIZED, 'Employee not found.');
    }

    if (employee.blacklistedTokens.includes(token)) {
      return resMessage(res, HTTP_STATUS_CODES.UNAUTHORIZED, 'Invalid token');
    }

    req.locals = {
      employee: employee,
    };
    next();
  } catch (err: any) {
    next(new Error(`Tokenization error!: ${err.message}`));
  }
};

const verifyDeleteUserMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const userIdToDelete = req.params.id;

    if (!token) {
      return resMessage(res, HTTP_STATUS_CODES.UNAUTHORIZED, 'Authorization token not provided.', null);
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as { _id: string };
    const employee: any = await Employee.findById(decodedToken._id);

    if (!employee) {
      return resMessage(res, HTTP_STATUS_CODES.UNAUTHORIZED, 'Employee not found.');
    }

    if (employee?._id.toString() === userIdToDelete) {
      return resMessage(
        res,
        HTTP_STATUS_CODES.BAD_REQUEST,
        "Can't delete account. User is still logging in!",
        null
      );
    } else {
      next();
    }
  } catch (err: any) {
    next(new Error(`An error occur when verification to delete user !: ${err.message}`));
  }
};

export { verifyTokenMiddleware, verifyDeleteUserMiddleware };
