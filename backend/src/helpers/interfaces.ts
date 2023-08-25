import { Types } from 'mongoose';

export interface ErrorResponse {
  status: number;
  message: string;
  stack?: any;
}

export interface IProject {
  projectName: string;
  language: string;
  description?: string;
  startDate: string;
  endDate: string;
}

export interface IEmployee {
  employeeName: string;
  email: string;
  password?: string | null;
  profilePhoto?: string;
  address?: string;
  phone?: string;
  dateOfBirth?: string;
  position: number;
  verified?: boolean;
  verificationToken?: string;
  blacklistedTokens: string[];
}

export interface ITask {
  project: Types.ObjectId;
  title: string;
  description: string;
  employee: Types.ObjectId;
  estimateHour: number;
  estimateStartDate?: string | null;
  estimateEndDate?: string | null;
  status?: number | null;
  actualHour?: number | null;
  actualStartDate?: string | null;
  actualEndDate?: string | null;
}

export interface IReport {
  reportTo: string;
  task: Types.ObjectId;
  projectName: string;
  taskTitle: string;
  percentage: number;
  types: string;
  status: string;
  hour: number;
  problem_feeling?: string;
  reportBy?: string;
}
