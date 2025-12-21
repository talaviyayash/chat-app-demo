import mongoose from 'mongoose';
import { env } from './envConfig';

const db = async (): Promise<void> => {
  try {
    await mongoose.connect(env.MONGO_URI as string);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};

db();
