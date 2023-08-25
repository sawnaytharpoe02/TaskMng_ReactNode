import mongoose from 'mongoose';

const EmployeeSchema = new mongoose.Schema(
  {
    employeeName: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      unique: true,
    },
    profilePhoto: {
      type: String,
    },
    address: {
      type: String,
    },
    phone: {
      type: String,
      unique: true,
    },
    dateOfBirth: {
      type: String,
    },
    position: {
      type: Number,
      default: 1,
    },
    verified: {
      type: Boolean,
    },
    verificationToken: {
      type: String,
    },
    blacklistedTokens: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

const Employee = mongoose.model('employee', EmployeeSchema);
export default Employee;
