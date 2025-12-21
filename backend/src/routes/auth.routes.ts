import { Router } from 'express';
import { validateRequest } from '../utils/validateRequest';
import authValidation from '../validators/auth.validator';
import authController from '../controller/auth.controller';

const authRouter = Router();

authRouter.post(
  '/signup',
  validateRequest(authValidation.signupSchema),
  authController.signup,
);

authRouter.post(
  '/signin',
  validateRequest(authValidation.signinSchema),
  authController.signin,
);

export default authRouter;
