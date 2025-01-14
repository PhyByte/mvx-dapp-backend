import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

/**
 * Guard that protects routes by validating bearer tokens.
 * It extracts the bearer token from the Authorization header and checks its validity
 * against the wallet tokens stored in the database.
 */
@Injectable()
export class BearerAuthGuard implements CanActivate {
  constructor(private prismaService: PrismaService) {}

  /**
   * Determines if the request is authorized based on the bearer token.
   * @param context The execution context, providing access to the request.
   * @returns {Promise<boolean>} Whether the request is authorized.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<CustomRequest>();
    const authHeader = request.headers['authorization'] as string;

    // If no Authorization header is present, deny access.
    if (!authHeader) {
      return false;
    }

    const token = authHeader.split(' ')[1]; // Extract the bearer token.

    // If the token is empty or undefined, deny access.
    if (!token) {
      return false;
    }

    // Validate the token.
    const wallet = await this.validateToken(token);

    if (wallet) {
      // Attach wallet address to the request if the token is valid.
      request.address = wallet.address;
      return true;
    } else {
      return false; // Deny access if the token is invalid.
    }
  }

  /**
   * Validates the provided bearer token by checking if it exists in the database.
   * @param token The bearer token to validate.
   * @returns {Promise<{ address: string } | null>} The wallet associated with the token, or null if invalid.
   */
  private async validateToken(token: string) {
    try {
      // Find the wallet that matches the provided token.
      return await this.prismaService.wallet.findUnique({
        where: { bearerToken: token },
      });
    } catch (err) {
      console.error('Error validating token:', err);
      return null; // Return null if validation fails.
    }
  }
}

/**
 * Extends the standard Request object to include an optional 'address' field.
 * This field represents the wallet address attached to the request after successful authentication.
 */
export interface CustomRequest extends Request {
  address?: string;
}