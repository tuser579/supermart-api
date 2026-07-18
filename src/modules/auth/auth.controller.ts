import { Request, Response } from 'express';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { ApiResponse } from '../../shared/utils/ApiResponse';
import { authService } from './auth.service';

export const authController = {
  register: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.register(req.body);
    res.status(201).json(
      ApiResponse.created('Registration successful. Please verify your email with the OTP sent.', result)
    );
  }),

  login: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.login(req.body);
    res.status(200).json(
      ApiResponse.success('Login successful', result)
    );
  }),

  verifyOTP: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.verifyOTP(req.body);
    res.status(200).json(
      ApiResponse.success(result.message, null)
    );
  }),

  resendOTP: asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;
    const result = await authService.resendOTP(email);
    res.status(200).json(
      ApiResponse.success(result.message, null)
    );
  }),

  refreshToken: asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    const result = await authService.refreshToken(refreshToken);
    res.status(200).json(
      ApiResponse.success('Token refreshed successfully', result)
    );
  }),

  logout: asyncHandler(async (_req: Request, res: Response) => {
    // Stateless JWT — client deletes the token
    // In production, add token to a Redis blacklist here
    res.status(200).json(
      ApiResponse.success('Logged out successfully', null)
    );
  }),
};
