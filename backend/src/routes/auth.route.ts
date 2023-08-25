import { Router } from 'express';
import {
  changePassword,
  sendResetPasswordLink,
  resetPassword,
  login,
  logout,
  verifyEmail,
} from '../controllers/auth.controller';

const router = Router();

router.post('/login', login);
router.put('/change-password', changePassword);
router.post('/logout', logout);
router.post('/forgot-password', sendResetPasswordLink);
router.post('/reset-password/:token', resetPassword);
router.post('/verify-email/:token', verifyEmail);

export { router as authRoute };
