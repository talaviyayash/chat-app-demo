import { Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    interface Response {
      success(statusCode: number, message: string, data?: any): Response;
    }
  }
}

export const responseHelper = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.success = function (statusCode: number, message: string, data?: any) {
    return this.status(statusCode).json({
      success: true,
      message,
      data,
    });
  };
  next();
};
