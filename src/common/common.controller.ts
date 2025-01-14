import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Controller for handling common utility requests such as health checks and configuration retrieval.
 */
@Controller()
export class CommonController {
  private lastDeployment: Date = new Date();

  constructor(private configService: ConfigService) {}

  /**
   * Health check endpoint.
   * @returns {string} 'All Systems Up' if the service is running.
   */
  @Get('/up')
  checkUp() {
    return 'All Systems Up';
  }

  /**
   * Retrieves configuration settings such as the current network and deployment time.
   * @returns {Object} The network config, deployment time, and current server time.
   */
  @Get('/config')
  getConfig() {
    const network = this.configService.get<string>('NETWORK');
    return {
      network: network, // The current network
      deployed: this.lastDeployment, // When the service was last deployed
      now: new Date(), // Current server time
    };
  }
}