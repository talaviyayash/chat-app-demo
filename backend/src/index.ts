import './config/envConfig';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { errorHandler } from './middlewares/errorHandler.middleware';
import { responseHelper } from './middlewares/responseHelper.middleware';
import { env } from './config/envConfig';
import './config/db';
import authRouter from './routes/auth.routes';



const app = express();
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


app.use(errorHandler);
  
app.listen(env.PORT, () => {
  console.log(`Running on ${env.PORT}`);
});
