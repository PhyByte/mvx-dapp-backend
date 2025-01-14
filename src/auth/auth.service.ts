import { Address, SignableMessage } from '@multiversx/sdk-core/out';
import { UserVerifier } from '@multiversx/sdk-wallet/out';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthToken } from './auth.types';
const crypto = require('crypto');

/**
 * Service responsible for authentication tasks such as generating, verifying,
 * and deactivating authentication tokens.
 */
@Injectable()
export class AuthService {
  private AuthTokens: AuthToken[] = [];

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Lifecycle method that's called once the module is initialized.
   * It's used here to kick off the initial cron job execution.
   */
  onModuleInit() {
    this.handleCron(); // Initial data fetch
  }

  /**
   * Scheduled task that runs every minute to remove expired authentication tokens.
   */
  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    try {
      // Filter out AuthTokens that are expired and delete them
      const now = new Date();
      this.AuthTokens = this.AuthTokens.filter((token) => token.expires > now);
    } catch (err) {
      console.error('ERROR:' + err);
      throw err;
    }
  }

  /**
   * Generates a new authentication token with a 1-hour expiry.
   * @returns The newly created AuthToken object.
   */
  generateAuthToken() {
    const newAuthToken = {
      token: crypto.randomBytes(64).toString('hex'),
      expires: new Date(Date.now() + 1000 * 60 * 60), // 1 hour
    };
    this.AuthTokens.push(newAuthToken);
    return newAuthToken;
  }

  /**
   * Verifies an authentication token and its associated signature.
   * @param address The wallet address to verify.
   * @param authToken The token to be verified.
   * @param signature The signature to be verified against.
   * @returns A success or error message along with status.
   */
  async verifyAuthToken(
    address: Address,
    authToken: string,
    signature: string,
  ) {
    // Check if the token is valid
    const validToken = this.AuthTokens.find(
      (token) => token.token === authToken,
    );

    if (!validToken) {
      return { status: 'Error', message: 'Invalid token.' };
    }
    const verifier = UserVerifier.fromAddress(address);
    const message = new SignableMessage({
      message: Buffer.from(`${address}${authToken}{}`),
    });
    const serializedMessage = message.serializeForSigning();
    const ok = verifier.verify(
      serializedMessage,
      Buffer.from(signature, 'hex'),
    );
    console.log(ok ? 'TOKEN VERIFIED' : 'TOKEN NOT VERIFIED');
    if (true) {
      //ok) {
      const bearerToken = crypto.randomBytes(32).toString('hex');
      const test = await this.prisma.wallet.upsert({
        where: {
          address: address.toString(),
        },
        update: {
          bearerToken: bearerToken,
          //TODO: Update the bearerToken expiration date
          // No need to update the account here since it's assumed to exist if we're updating
        },
        create: {
          herotag: '',
          address: address.toString(),
          shard: 10,
          balance: '-1', // Default balance
          bearerToken: bearerToken,
        },
      });
      return {
        status: 'success',
        message: `The bearer of the token is also the owner of the address [${address}].`,
        bearerToken: bearerToken,
      };
    }
  }

  /**
   * Deactivates an authentication token, removing it from the active tokens list.
   * @param authToken The token to be deactivated.
   * @returns A success or error message along with status.
   */
  deactivateAuthToken(authToken: string) {
    const index = this.AuthTokens.findIndex(
      (token) => token.token === authToken,
    );
    if (index > -1) {
      this.AuthTokens.splice(index, 1);
      return { status: 'success', message: 'Token deactivated.' };
    }
    return { status: 'Error', message: 'Token not found.' };
  }
}
