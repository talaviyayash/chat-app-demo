import { Server } from 'socket.io';
import { socketAuthMiddleware, AuthenticatedSocket } from '../middlewares/socketAuth.middleware';

export const initializeSocketServer = (io: Server) => {
  // io.use(socketAuthMiddleware);

  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log(`User connected: ${socket.userId}`);

    if (socket.userId) {
      const roomId = `user-${socket.userId}`;
      socket.join(roomId);
      console.log(`User ${socket.userId} joined room: ${roomId}`);

      socket.emit('authenticated', {
        message: 'Successfully authenticated and joined room',
        userId: socket.userId,
        roomId: roomId,
      });
    }

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.userId}`);
    });
  });
};
