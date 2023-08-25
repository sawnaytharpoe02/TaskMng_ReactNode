import nodemailer from 'nodemailer';
import { HTTP_STATUS_CODES } from '../helpers/status';

const sendEmail = async (email: string, subject: string, text: string) => {
  try {
    let config = {
      host: process.env.MAIL_SERVICE,
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    };
    let transporter = nodemailer.createTransport(config);

    let message = {
      from: process.env.MAIL_USER,
      to: email,
      subject: subject,
      html: text,
    };
    await transporter.sendMail(message);

    console.log('Email sent successfully');
  } catch (error: any) {
    console.log('Error while sending email:', error);
    if (error.responseCode === HTTP_STATUS_CODES.SMTP_ERROR) {
      console.log('Invalid or non-existent email address');
    } else {
      console.log('Other email sending error:', error.message);
    }
  }
};

export { sendEmail };
