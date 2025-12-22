import { Server } from 'socket.io';
import { socketAuthMiddleware, AuthenticatedSocket } from '../middlewares/socketAuth.middleware';
import { messageSocket } from './message.socket';

export const initializeSocketServer = (io: Server) => {
  io.use(socketAuthMiddleware);

  io.on('connection', (socket: AuthenticatedSocket) => {
    if (socket.user) {
      const roomName = `user-${socket.user.id}`;
      socket.join(roomName);
      console.log(`User ${socket.user.id} joined personal room: ${roomName}`);
    }

    messageSocket(io, socket);

    socket.on('disconnect', () => {
      console.log('User disconnected', socket.id);
    });
  });
};
