import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/envConfig';



const generateJWT = (payload: { id: string }): string => {
  if (!env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  const options: SignOptions = {
      expiresIn: env.JWT_EXPIRES_IN || '7d',
    };

    return jwt.sign(payload, env.JWT_SECRET, options);
  }


const verifyJWT = (token: string): { id: string } => {
    if (!env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    return jwt.verify(token, env.JWT_SECRET) as { id: string };
  }

const JWTHelper = { generateJWT, verifyJWT };
export default JWTHelper;
