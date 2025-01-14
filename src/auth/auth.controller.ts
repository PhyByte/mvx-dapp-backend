import { Address } from '@multiversx/sdk-core/out';
import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';

/**
 * Controller that handles HTTP requests for authentication-related operations
 * such as token generation, verification, and deactivation.
 */
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Endpoint to generate a new authentication token.
   * @param res The response object to send back the generated token.
   */
  @Get('/generateToken')
  async generateAuthToken(@Res() res: Response) {
    try {
      const token = await this.authService.generateAuthToken();
      res.json(token);
    } catch (err) {
      console.error('ERROR:', err);
      res.status(500).send('Internal Server Error');
    }
  }

  /**
   * Endpoint to verify an authentication token along with a signature.
   * @param address The wallet address associated with the token.
   * @param authToken The token to verify.
   * @param signature The signature to verify.
   * @param res The response object to return the verification result.
   */
  @Get('/verifyToken/:address/:authToken/:signature')
  async verifyAuthToken(
    @Param('address') address: Address,
    @Param('authToken') authToken: string,
    @Param('signature') signature: string,
    @Res() res: Response,
  ) {
    try {
      const result = await this.authService.verifyAuthToken(
        new Address(address),
        authToken,
        signature,
      );
      if (result.status==='success') {
        res.json(result);
      } else {
        res.status(401).send('Token is invalid');
      }
    } catch (err) {
      console.error('ERROR:', err);
      res.status(500).send('Internal Server Error');
    }
  }

  /**
   * Endpoint to deactivate an authentication token.
   * @param authToken The token to be deactivated.
   * @param res The response object to send back the deactivation result.
   */
  @Get('/deactivateToken/:authToken')
  async deactivateAuthToken(
    @Param('authToken') authToken: string,
    @Res() res: Response,
  ) {
    try {
      const result = await this.authService.deactivateAuthToken(authToken);
      res.json(result);
    } catch (err) {
      console.error('ERROR:', err);
      res.status(500).send('Internal Server Error');
    }
  }
}
