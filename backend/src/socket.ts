import { Server, Socket } from 'socket.io';
import JWTHelper from './utils/jwtHelper';

interface AuthenticatedSocket extends Socket {
  user?: { id: string };
}

export const initializeSocketServer = (io: Server) => {
  io.use((socket: AuthenticatedSocket, next) => {
    const token =
      socket.handshake.auth.token || socket.handshake.headers['authorization'];

    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    try {
      const decoded = JWTHelper.verifyJWT(
        token.startsWith('Bearer ') ? token.slice(7) : token,
      );
      socket.user = { id: decoded.id };
      next();
    } catch (err) {
      console.log('🚀 ~ initializeSocketServer ~ err:', err);
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    if (socket.user) {
      const roomName = `user-${socket.user.id}`;
      socket.join(roomName);
      console.log(`User connected: ${socket.id}, joined room: ${roomName}`);
    }

    socket.on('disconnect', () => {
      console.log('User disconnected', socket.id);
    });
  });
};
