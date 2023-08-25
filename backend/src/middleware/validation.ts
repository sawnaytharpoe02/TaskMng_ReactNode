import { Request, Response, NextFunction } from 'express';
import { employeeSchema, AllSchema, projectSchema, taskSchema, reportSchema } from '../helpers/schema';
import { ObjectSchema } from 'joi';

const validateBody = (schema: ObjectSchema<any>, isArray: boolean = false) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const validateItem = (item: any) => {
      const { error: itemError } = schema.validate(item);
      if (itemError) {
        return itemError.details[0].message;
      }
      return null;
    };

    if (isArray && Array.isArray(req.body)) {
      const arrayErrors = req.body.map((item, index) => {
        return validateItem(item) && `${index}: ${validateItem(item)}`;
      });

      const errors = arrayErrors.filter(Boolean).map((message: any) => new Error(message));
      if (errors.length > 0) {
        return next(errors);
      }
    } else {
      const { error } = schema.validate(req.body);
      if (error) {
        return next(new Error(error?.details[0].message));
      }
    }

    next();
  };
};

const validateParams = (schema: ObjectSchema<any>, type: string) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    let obj: Record<string, any> = {};
    obj[type] = req.params[type];
    const { error } = schema.validate(obj);
    if (error) {
      next(new Error(error.details[0].message));
    }
    next();
  };
};

const validateProject = validateBody(projectSchema);
const validateEmployee = validateBody(employeeSchema);
const validateTask = validateBody(taskSchema);
const validateReport = validateBody(reportSchema, true);
const validateId = validateParams(AllSchema.params, 'id');

export { validateProject, validateEmployee, validateTask, validateReport, validateId };
