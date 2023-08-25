import { Request, Response, NextFunction } from 'express';
import {
  changePasswordService,
  loginService,
  logoutService,
  resetPasswordService,
  sendResetpasswordLinkService,
  verifyEmailService,
} from '../services/auth.services';

const login = async (req: Request, res: Response, next: NextFunction) => {
  await loginService(req, res, next);
};

const changePassword = async (req: Request, res: Response, next: NextFunction) => {
  await changePasswordService(req, res, next);
};

const logout = async (req: Request, res: Response, next: NextFunction) => {
  await logoutService(req, res, next);
};

const sendResetPasswordLink = async (req: Request, res: Response, next: NextFunction) => {
  await sendResetpasswordLinkService(req, res, next);
};

const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  await resetPasswordService(req, res, next);
};

const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  await verifyEmailService(req, res, next);
};
export { login, changePassword, logout, sendResetPasswordLink, resetPassword, verifyEmail };
