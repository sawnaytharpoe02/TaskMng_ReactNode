import { Request, Response, NextFunction } from 'express';
import Employee from '../models/employee.model';
import bcrypt from 'bcrypt';
import { resMessage } from '../helpers/res.message';
import { HTTP_STATUS_CODES } from '../helpers/status';
import { IEmployee } from '../helpers/interfaces';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../utils/send-email';
import { generateResetPasswordTemplate } from '../helpers/templates/resetpass-email.template';

const loginService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const employee: any = await Employee.findOne({ email }).select('-__v -blacklistedTokens');
    if (!employee) {
      resMessage(res, HTTP_STATUS_CODES.BAD_REQUEST, 'There is no employee with this email', null);
      return;
    }

    if (!employee.verified) {
      resMessage(res, HTTP_STATUS_CODES.UNAUTHORIZED, 'Email not verified. Please verify your email first.');
      return;
    }

    const match = await bcrypt.compare(password, employee?.password);
    if (match!) {
      employee.verificationToken = null;
      let employeeObj = employee.toObject();
      delete employeeObj.password;

      const generateToken = jwt.sign(employeeObj, process.env.JWT_SECRET_KEY as string, {
        expiresIn: '24hr',
      });
      employeeObj.token = generateToken;
      resMessage(res, HTTP_STATUS_CODES.OK, 'login successfully!', employeeObj);
    } else {
      resMessage(res, HTTP_STATUS_CODES.BAD_REQUEST, 'password credential error!', null);
      return;
    }
  } catch (err: any) {
    next(new Error(`user login failed: ${err}`));
  }
};

const verifyEmailService = async (req: Request, res: Response, next: NextFunction) => {
  const verificationToken = req.params.token;

  try {
    const employee = await Employee.findOneAndUpdate(
      { verificationToken, verified: false },
      { $set: { verified: true, verificationToken: null } },
      { new: true }
    );

    if (!employee) {
      return next(new Error('Employee not found or already verified.'));
    }

    resMessage(res, HTTP_STATUS_CODES.OK, `Email verified for employee: ${employee?.employeeName}`, employee);
  } catch (error) {
    next(new Error('Invalid verification token.'));
  }
};

const changePasswordService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, oldPassword, newPassword, confirmPassword } = req.body;
    const employee: any = await Employee.findOne({ email });
    if (!employee) {
      return next(new Error(`user doesn't exist.`));
    }
    const passwordMatch = await bcrypt.compare(oldPassword, employee.password);
    if (!passwordMatch) {
      return next(new Error('The password does not match with your old password.'));
    }

    if (oldPassword === newPassword && confirmPassword) {
      return next(new Error(`Old password and new password should not be the same!`));
    }

    if (newPassword === confirmPassword) {
      await bcrypt.hash(oldPassword && newPassword, 10, async (err, hashedPassword) => {
        if (err) {
          next(new Error('An error occur while hashing the password.'));
        }
        const updateEmployee: IEmployee = {
          ...req.body,
          password: hashedPassword,
        };

        try {
          const result = await Employee.findByIdAndUpdate(employee.id, updateEmployee, { new: true });
          resMessage(res, HTTP_STATUS_CODES.OK, 'Change password successfully', result);
        } catch (err: any) {
          next(new Error(`Updating the password failed : ${err}`));
        }
      });
    } else {
      next(new Error('new password and confirm password are not match!'));
    }
  } catch (error) {
    next(new Error('Change password failed.'));
  }
};

const logoutService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token: any = req.headers.authorization?.split(' ')[1];

    if (!token) {
      next(new Error('User is not logged in!'));
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as unknown as {
      _id: string;
    };

    await Employee.findByIdAndUpdate(decodedToken._id, { $addToSet: { blacklistedTokens: token } });
    resMessage(res, HTTP_STATUS_CODES.OK, 'Logged out successfully!', null);
  } catch (err: any) {
    next(new Error(`Logout process failed: ${err.message}`));
  }
};

const sendResetpasswordLinkService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    const employee: any = await Employee.findOne({ email });
    if (!employee) {
      return next(new Error('There is no employee with this email!'));
    }

    const resetToken = jwt.sign({ email }, process.env.JWT_SECRET_KEY as string, { expiresIn: '24h' });
    const resetLink = `${process.env.CLIENT_DOMAIN}/reset-password?token=${resetToken}`;

    const emailContent = generateResetPasswordTemplate(employee?.employeeName, email, resetLink);
    return await sendEmail(email, 'Password Reset Link', emailContent)
      .then(() => {
        return resMessage(
          res,
          HTTP_STATUS_CODES.OK,
          'Password reset link sent to your gmail successfully!',
          null
        );
      })
      .catch(() => {
        return resMessage(
          res,
          HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
          'Sending password reset link failed',
          null
        );
      });
  } catch (err: any) {
    next(new Error(`An error occur while changing the password: ${err.message}`));
  }
};

const resetPasswordService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.params;
    const { newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      next(new Error('new password and confirm password must be the same'));
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as { email: string };
    const employee: any = await Employee.findOne({ email: decodedToken.email });
    if (!employee) {
      next(new Error('User not found.'));
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    try {
      employee.password = hashedPassword;
      const result = await employee.save();

      return resMessage(res, HTTP_STATUS_CODES.OK, 'your password has been successfully reset.', result);
    } catch (err: any) {
      next(new Error(`Password resetting failed : ${err.message}`));
    }
  } catch (err: any) {
    next(new Error(`An error occur while resetting password: ${err.message}`));
  }
};

export {
  loginService,
  logoutService,
  changePasswordService,
  sendResetpasswordLinkService,
  resetPasswordService,
  verifyEmailService,
};
