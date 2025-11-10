import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { User, UserRole } from '../entities/User.entity';
import { hashPassword, comparePassword } from '../utils/password.util';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../utils/jwt.util';

/**
 * Auth Service
 * Handles all business logic related to authentication
 */
export class AuthService {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  /**
   * Register a new user
   */
  async register(userData: {
    nombre: string;
    email: string;
    password: string;
    role?: UserRole;
  }): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new Error('El email ya está registrado');
    }

    // Hash password
    const hashedPassword = await hashPassword(userData.password);

    // Create user
    const user = this.userRepository.create({
      nombre: userData.nombre,
      email: userData.email,
      password: hashedPassword,
      role: userData.role || UserRole.USER,
    });

    await this.userRepository.save(user);

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Remove password from response
    const userWithoutPassword = { ...user };
    delete (userWithoutPassword as any).password;

    return {
      user: userWithoutPassword as User,
      accessToken,
      refreshToken,
    };
  }

  /**
   * Login a user
   */
  async login(credentials: {
    email: string;
    password: string;
  }): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    // Find user with password field
    const user = await this.userRepository.findOne({
      where: { email: credentials.email },
      select: ['id', 'nombre', 'email', 'password', 'role', 'createdAt', 'updatedAt'],
    });

    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    // Compare passwords
    const isPasswordValid = await comparePassword(
      credentials.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new Error('Credenciales inválidas');
    }

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Remove password from response
    const userWithoutPassword = { ...user };
    delete (userWithoutPassword as any).password;

    return {
      user: userWithoutPassword as User,
      accessToken,
      refreshToken,
    };
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    try {
      // Verify refresh token
      const payload = verifyRefreshToken(refreshToken);

      // Check if user still exists
      const user = await this.userRepository.findOne({
        where: { id: payload.userId },
      });

      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      // Generate new tokens
      const newAccessToken = generateAccessToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      const newRefreshToken = generateRefreshToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw new Error('Token de refresco inválido o expirado');
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    return user;
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    return user;
  }

  /**
   * Check if email exists
   */
  async emailExists(email: string): Promise<boolean> {
    const count = await this.userRepository.count({
      where: { email },
    });
    return count > 0;
  }
}

// Export singleton instance
export const authService = new AuthService();
