//Authentication
export const MESSAGE = {
  // employee
  EMPLOYEE_NAME_REQUIRED: 'Please input employee name!',
  NAME_MAX_LENGTH_FORMAT: 'Name must be at least three characters',
  // project
  PROJECT_NAME_REQUIRED: 'Please input your project name!',
  PROJECT_LANGUAGE_REQUIRED: 'Please input project language!',
  PROJECT_START_DATE_REQUIRED: 'Please input project start date!',
  PROJECT_END_DATE_REQUIRED: 'Please input project end date!',
  END_DATE_VALIDATE: 'End date cannot less than start date!',
  // email
  EMAIL_REQUIRED: 'Please input email address!',
  EMAIL_INVALID_FORMAT: 'Invalid email address!',
  // phone
  PHONE_REQUIRED: 'Please input phone number!',
  PHONE_INVALID_FORMAT: 'Phone number should be a number!',
  PHONE_MAX_LENGTH_FORMAT: 'Phone number cannot be longer than 11 digits!',
  PHONE_MIN_LENGTH_FORMAT: 'Phone number must be 11 digits!',
  // password
  PASSWORD_REQUIRED: 'Please input your password!',
  PASSWORD_OLD_REQUIRED: 'Please input your old password!',
  PASSWORD_NEW_REQUIRED: 'Please input your new password!',
  PASSWORD_CONFIRM_REQUIRED: 'Please input your confirm password!',
  PASSWORD_INVALID_FORMAT: 'Password must be 8 characters!',
  PASSWORD_CONFIRM_MISMATCH: 'Confirm password does not match the new password.',
  PASSWORD_OLD_NEW_MISMATCH: 'New password should not be the same as the old password.',
  PASSWORD_CHANGE_SUCCESS: 'Password changed successfully!',
  // hour
  HOUR_NUMBER_VALIDATE: 'Hour cannot be less than 0',
  HOUR_MAX_LENGTH_VALIDATE: 'Maximum 50 hours!',
};

export const VALIDATE = {
  EMAIL_REGEX: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  HOUR_REGEX: /^[0-9]$/,
  PHONE_REGEX: /^\d+$/,
  PHONE_LENGTH_REGEX: /^\d{11}$/,
};
