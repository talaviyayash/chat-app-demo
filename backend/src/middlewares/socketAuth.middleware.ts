import { Socket } from 'socket.io';
import JWTHelper from '../utils/jwtHelper';

export interface AuthenticatedSocket extends Socket {
  userId?: string;
}

export const socketAuthMiddleware = async (
  socket: AuthenticatedSocket,
  next: (err?: Error) => void,
) => {
  try {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
    console.log('token', token)

    if (!token) {
      return next(new Error('Authentication token is required'));
    }

    const decoded = JWTHelper.verifyJWT(token);

    if (!decoded || !decoded.id) {
      return next(new Error('Invalid token'));
    }

    socket.userId = decoded.id;
    next();
  } catch (error) {
    next(new Error('Authentication failed'));
  }
};
