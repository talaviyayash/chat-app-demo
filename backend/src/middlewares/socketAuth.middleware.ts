import { Socket } from 'socket.io';
import JWTHelper from '../utils/jwtHelper';

export interface AuthenticatedSocket extends Socket {
    user?: { id: string };
}

export const socketAuthMiddleware = (
    socket: AuthenticatedSocket,
    next: (err?: Error) => void,
) => {
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
        console.log('🚀 ~ socketAuthMiddleware ~ err:', err);
        next(new Error('Authentication error: Invalid token'));
    }
};
