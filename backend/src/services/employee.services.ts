import { Request, Response, NextFunction } from 'express';
import Employee from '../models/employee.model';
import { v2 as cloudinary } from 'cloudinary';
import { generateRandomPassword } from '../utils/random-password.generator';
import bcrypt from 'bcrypt';
import { sendEmail } from '../utils/send-email';
import { generateTemporaryPasswordEmailTemplate } from '../helpers/templates/verify-email.template';
import { HTTP_STATUS_CODES } from '../helpers/status';
import { resMessage } from '../helpers/res.message';
import crypto from 'crypto';

const defaultProfile =
  'https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?w=740&t=st=1690357726~exp=1690358326~hmac=e49a4665f42b5c5e130073ee52b0338c64c78aae2025d7262989045151ae20d6';

const findAllEmployeeService = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await Employee.find().sort({ createdAt: -1 });
    resMessage(res, HTTP_STATUS_CODES.OK, 'Retrieve all employee successfully.', result);
  } catch (err: any) {
    next(new Error(`Failed retrieve all employee: ${err}`));
  }
};

const findEmployeeService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee)
      return resMessage(res, HTTP_STATUS_CODES.OK, `There is no employee with this ${req.params.id}`, null);

    resMessage(res, HTTP_STATUS_CODES.OK, 'Retrieve employee successfully.', employee);
  } catch (err: any) {
    next(new Error(`Failed retrieve employee: ${err}`));
  }
};

const createEmployeeService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { employeeName, email, phone, profilePhoto } = req.body;

    const employee_name = await Employee.findOne({ employeeName });
    if (employee_name) {
      return resMessage(res, HTTP_STATUS_CODES.BAD_REQUEST, 'Employee name already exist.', null);
    }

    const employee_email = await Employee.findOne({ email });
    if (employee_email) {
      return resMessage(res, HTTP_STATUS_CODES.BAD_REQUEST, 'Email already exist.', null);
    }

    const employee_phone = await Employee.findOne({ phone });
    if (employee_phone) {
      return resMessage(res, HTTP_STATUS_CODES.BAD_REQUEST, 'Phone number already exist.', null);
    }

    const randomPassword = generateRandomPassword(10);
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationLink = `${process.env.CLIENT_DOMAIN}/verify-email?token=${verificationToken}`;

    const finalProfilePhoto: any =
      profilePhoto === 'default' ? defaultProfile : await cloudinary.uploader.upload(profilePhoto);
    const newEmployee = {
      ...req.body,
      profilePhoto: profilePhoto !== 'default' ? finalProfilePhoto.secure_url : finalProfilePhoto,
      password: hashedPassword,
      verified: false,
      verificationToken,
    };

    const result = await new Employee(newEmployee).save();

    const emailContent = generateTemporaryPasswordEmailTemplate(
      employeeName,
      email,
      verificationLink,
      randomPassword
    );
    await sendEmail(email, 'Verify Your Email', emailContent);

    const responseMessage = `User created. Temporary password and email verification link have been sent to user's email.`;
    resMessage(res, HTTP_STATUS_CODES.OK, responseMessage, result);
  } catch (err: any) {
    next(new Error(`Failed create employee: ${err.message}`));
  }
};

const updateEmployeeService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { profilePhoto, email } = req.body;
    const employee = await Employee.findById(req.params.id);
    if (!employee)
      return resMessage(
        res,
        HTTP_STATUS_CODES.OK,
        `There is no employee with this ${req.params.id} id to update!`,
        null
      );

    const employee_email = await Employee.findOne({ email, _id: { $ne: req.params.id } });
    if (employee_email) {
      return resMessage(res, HTTP_STATUS_CODES.BAD_REQUEST, 'Email already exist.', null);
    }

    const finalProfilePhoto =
      profilePhoto === 'original'
        ? employee?.profilePhoto
        : profilePhoto === 'default'
        ? defaultProfile
        : (await cloudinary.uploader.upload(profilePhoto)).secure_url;

    const editEmployee = {
      ...req.body,
      profilePhoto: finalProfilePhoto,
    };

    const result: any = await Employee.findByIdAndUpdate(employee?.id, editEmployee, { new: true });
    resMessage(res, HTTP_STATUS_CODES.OK, 'Updated employee successfully.', result);
  } catch (err: any) {
    next(new Error(`Failed update employee: ${err.message}`));
  }
};

const deleteEmployeeService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) next(new Error(`There is no employee with this ${req.params.id} id to delete!`));

    const result: any = await Employee.findByIdAndDelete(req.params.id);
    resMessage(res, HTTP_STATUS_CODES.OK, 'Deleted employee successfully.', result);
  } catch (err: any) {
    next(new Error(`Failed delete employee: ${err.message}`));
  }
};

export {
  findAllEmployeeService,
  findEmployeeService,
  createEmployeeService,
  updateEmployeeService,
  deleteEmployeeService,
};
