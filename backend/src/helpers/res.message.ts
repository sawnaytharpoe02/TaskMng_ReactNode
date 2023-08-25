export const resMessage = (res: any, statusCode = 200, message = 'success', result: any = []) => {
  res.status(statusCode).json({
    status: statusCode,
    message,
    result,
  });
};
