import Joi from 'joi';

export const projectSchema = Joi.object({
  projectName: Joi.string().required(),
  language: Joi.string().required(),
  description: Joi.string(),
  startDate: Joi.string().required(),
  endDate: Joi.string().required(),
});

export const employeeSchema = Joi.object({
  employeeName: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  profilePhoto: Joi.string().allow(null).optional(),
  address: Joi.string().optional(),
  phone: Joi.string().required(),
  dateOfBirth: Joi.string().optional(),
  position: Joi.number().required(),
  verified: Joi.boolean().optional(),
  verificationToken: Joi.string().optional(),
});

export const taskSchema = Joi.object({
  project: Joi.alternatives().try(Joi.string().required(), Joi.object().required()),
  title: Joi.string().required(),
  description: Joi.string().required(),
  employee: Joi.alternatives().try(Joi.string().required(), Joi.object().required()),
  estimateHour: Joi.number().required(),
  estimateStartDate: Joi.string().allow(null).optional(),
  estimateEndDate: Joi.string().allow(null).optional(),
  status: Joi.number().optional(),
  actualHour: Joi.string(),
  actualStartDate: Joi.string().allow(null),
  actualEndDate: Joi.string().allow(null),
});

export const reportSchema = Joi.object({
  reportTo: Joi.string().required(),
  task: Joi.alternatives().try(Joi.string().required(), Joi.object().required()),
  projectName: Joi.string().required(),
  taskTitle: Joi.string().required(),
  percentage: Joi.number().required(),
  types: Joi.string().required(),
  status: Joi.string().required(),
  hour: Joi.number().integer().required(),
  problem_feeling: Joi.string().allow(null).optional(),
  reportBy: Joi.string().required(),
});

export const AllSchema = {
  params: Joi.object({
    id: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
  }),
};
