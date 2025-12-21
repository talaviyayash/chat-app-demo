import './config/envConfig';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { errorHandler } from './middlewares/errorHandler.middleware';
import { responseHelper } from './middlewares/responseHelper.middleware';
import { env } from './config/envConfig';
import './config/db';
import authRouter from './routes/auth.routes';
import chatRouter from './routes/chat.routes';
import { initializeSocketServer } from './socket/socketHandler';

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: true,
    credentials: true,
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms '),
);

app.use(responseHelper);

app.use('/api/auth', authRouter);
app.use('/api/chat', chatRouter);

app.use(errorHandler);

initializeSocketServer(io);

httpServer.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT}`);
  console.log(`WebSocket server ready`);
});
