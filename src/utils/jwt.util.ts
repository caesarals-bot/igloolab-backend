import jwt from 'jsonwebtoken';
import { env } from '../config/env';

/**
 * JWT utility functions
 * Handles token generation and verification
 */

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

/**
 * Generate an access token
 * @param payload - User data to encode in token
 * @returns JWT access token
 */
export const generateAccessToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
};

/**
 * Generate a refresh token
 * @param payload - User data to encode in token
 * @returns JWT refresh token
 */
export const generateRefreshToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  });
};

/**
 * Verify an access token
 * @param token - JWT access token
 * @returns Decoded token payload
 */
export const verifyAccessToken = (token: string): JwtPayload => {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
};

/**
 * Verify a refresh token
 * @param token - JWT refresh token
 * @returns Decoded token payload
 */
export const verifyRefreshToken = (token: string): JwtPayload => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtPayload;
};
