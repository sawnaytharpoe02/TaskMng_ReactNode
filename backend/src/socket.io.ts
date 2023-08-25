import { Server as SocketIOServer, Socket } from 'socket.io';

const connectedSockets: Set<Socket> = new Set();

export const configureSocket = (server: any) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket: Socket) => {
    connectedSockets.add(socket);

    socket.on('reportCreated', (data) => {
      socket.broadcast.emit('createReportNotifications', data);
    });

    socket.on('taskCreated', (data) => {
      socket.broadcast.emit('createTaskNotifications', data);
    });

    socket.on('taskUpdated', (data) => {
      socket.broadcast.emit('updateTaskNotifications', data);
    });

    socket.on('employeeCreated', (data) => {
      socket.broadcast.emit('createEmployeeNotifications', data);
    });

    socket.on('employeeUpdated', (data) => {
      socket.broadcast.emit('updateEmployeeNotifications', data);
    });

    socket.on('employeeDeleted', (data) => {
      socket.broadcast.emit('deleteEmployeeNotifications', data);
    });

    socket.on('projectCreated', (data) => {
      socket.broadcast.emit('createProjectNotifications', data);
    });

    socket.on('projectUpdated', (data) => {
      socket.broadcast.emit('updateProjectNotifications', data);
    });

    socket.on('projectDeleted', (data) => {
      socket.broadcast.emit('deleteProjectNotifications', data);
    });
  });
};
