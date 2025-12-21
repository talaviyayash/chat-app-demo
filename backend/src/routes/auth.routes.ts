import { Router } from 'express';
import { validateRequest } from '../utils/validateRequest';
import authValidation from '../validators/auth.validator';
import authController from '../controller/auth.controller';
import { protect } from '../middlewares/auth.middleware';

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

authRouter.get('/me', protect, authController.getProfile);

export default authRouter;
