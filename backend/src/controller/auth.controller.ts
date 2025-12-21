import { Request, Response, NextFunction } from 'express';
import UserService from '../service/user.service';
import JWTHelper from '../utils/jwtHelper';
import { AppError } from '../utils/AppError';

const signup = async (req: Request, res: Response) => {
    const email = req.body.email?.trim().toLowerCase();
    const { name, password } = req.body;

    const existingUser = await UserService.getUserByEmail(email);
    if (existingUser) {
      throw new AppError('User already exists.', 400);
    }

    const user = await UserService.createUser({
      email,
      name,
      password,
    });

    const userData = user.toObject();
    delete userData.password;
    delete userData.__v;

    const token = JWTHelper.generateJWT({ id: userData._id.toString() });

    return res.success(201, 'User signup successfully.', {
      token,
      user: userData,
    });
};

const signin = async (req: Request, res: Response) => {
    const { password } = req.body;
    const email = req.body.email?.trim().toLowerCase();

    const user = await UserService.getUserByEmail(email);
    if (!user) {
      throw new AppError('Invalid email or password.', 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new AppError('Invalid email or password.', 401);
    }

    const userData = user.toObject();
    delete userData.password;
    delete userData.__v;

    const token = JWTHelper.generateJWT({ id: userData._id.toString() });

    return res.success(200, 'Signin successful.', { token, user: userData });
};

const authController = {
  signup,
  signin,
};

export default authController;
