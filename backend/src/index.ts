import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import { v2 as cloudinary } from 'cloudinary';
import { errorHandler, routeNotFoundHandler } from './middleware/error';
import http from 'http';

import { projectRoute } from './routes/project.route';
import { employeeRoute } from './routes/employee.route';
import { taskRoute } from './routes/task.route';
import { reportRoute } from './routes/report.route';
import { authRoute } from './routes/auth.route';
import { configureSocket } from './socket.io';
import { notificationRoute } from './routes/noti.route';

const app = express();
const server = http.createServer(app);
configureSocket(server);

app.use(
  cors({
    origin: '*',
  })
);

dotenv.config();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// route setup
app.use('/api/v1/project', projectRoute);
app.use('/api/v1/employee', employeeRoute);
app.use('/api/v1/task', taskRoute);
app.use('/api/v1/report', reportRoute);
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/notification', notificationRoute);

// error handler
app.use(routeNotFoundHandler);
app.use(errorHandler);

// cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// mongo setup
const PORT = process.env.PORT;

const options: any = { useNewUrlParser: true, useUnifiedTopology: true };
mongoose
  .connect(process.env.MONGO_URL!, options)
  .then(() => {
    console.log('connected to mongo database');
    server.listen(PORT, () => {
      console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
    });
  })
  .catch((error: any) => {
    console.log(`${error}: did not connect`);
  });
