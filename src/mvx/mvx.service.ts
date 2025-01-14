import {
  ApiNetworkProvider,
  NetworkConfig,
} from '@multiversx/sdk-network-providers/out';
import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';

import { Address, IAddress } from '@multiversx/sdk-core/out';
import axios from 'axios';
import {
  getEnvVar,
  Network,
  selectDependingOnNetwork,
} from 'src/common/common.utils';
import { rateLimitedApiCall } from './rateLimiter';

@Injectable()
export class MvxService {
  public readonly mvxNetwork: Network;
  private readonly apiUrl: string;

  public storagenetworkProvider: ApiNetworkProvider;
  protected networkConfig: NetworkConfig;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    this.mvxNetwork = getEnvVar(this.configService, 'NETWORK') as Network;
    this.apiUrl = selectDependingOnNetwork(
      this.mvxNetwork,
      getEnvVar(this.configService, 'MAINNET_API'),
      getEnvVar(this.configService, 'DEVNET_API'),
    );

    this.storagenetworkProvider = new ApiNetworkProvider(this.apiUrl, {
      timeout: 60000,
      timeoutErrorMessage:
        'The request timed out. The service might be temporarily unavailable or too slow.',
    });
  }

  async onModuleInit() {
    console.log('Initializing MVX Service');
    this.handleCronMinute();
    this.handleCron10Minute();
  }

  @Cron(CronExpression.EVERY_MINUTE, { name: 'Refresh MVX Data' })
  async handleCronMinute() {
    console.log('Updating MVX Data: EVERY_MINUTE');
    try {
      this.networkConfig = await rateLimitedApiCall(async () => {
        await this.storagenetworkProvider.getNetworkConfig();
      });
      this.prisma.setMvx_Constants(
        await rateLimitedApiCall(
          async () =>
            await this.storagenetworkProvider.doGetGeneric('constants'),
        ),
      );
      //wait 1s
      await new Promise((resolve) => setTimeout(resolve, 1000));
      this.prisma.setMVX_Economics(
        await rateLimitedApiCall(
          async () =>
            await this.storagenetworkProvider.doGetGeneric('economics'),
        ),
      );
      //wait 1s
      await new Promise((resolve) => setTimeout(resolve, 1000));
      this.prisma.setMVX_Stats(
        await rateLimitedApiCall(
          async () => await this.storagenetworkProvider.doGetGeneric('stats'),
        ),
      );
    } catch (err) {
      console.error('ERROR updating MVX data:', err);
    }
  }

  @Cron(CronExpression.EVERY_10_MINUTES, {
    name: 'Refresh MVX Data 10 Minutes',
  })
  async handleCron10Minute() {
    console.log('Updating MVX Data: EVERY_10_MINUTES');
    try {
      // Logic specific to MVX service, such as updating ESDTs, collections, etc.
    } catch (err) {
      console.error('ERROR:' + err);
      throw err;
    }
  }

  //----------------------------
  // Getters
  //----------------------------
  getApiUrl() {
    return this.apiUrl;
  }

  getNetwork() {
    return this.mvxNetwork;
  }
  getEconomics() {
    return this.prisma.getMVX_Economics();
  }

  async handleApiRelay(endpoint: string): Promise<any> {
    console.log('Relaying request to:', endpoint);
    try {
      const url = `${this.apiUrl}/${endpoint}`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error(`Error relaying request to ${endpoint}:`, error);
      throw new HttpException(
        'Failed to relay request to API',
        error.response?.status || 500,
      );
    }
  }

  async getBalanceAndHerotagForAddress(
    address: string,
  ): Promise<{ balance: string; heroTag: string }> {
    try {
      // await this.rateLimitAwaiter();
      const account = await rateLimitedApiCall(
        async () =>
          await this.storagenetworkProvider.getAccount(new Address(address)),
      );
      // Assuming 'heroTag' is a property of the account object
      return {
        balance: account.balance.toString(),
        heroTag: account.userName,
      };
    } catch (err) {
      console.error('ERROR:' + err);
      throw err;
    }
  }

  async getShardForAddress(address: IAddress): Promise<number> {
    try {
      // await this.rateLimitAwaiter();
      const { data } = await rateLimitedApiCall(
        async () =>
          await axios.get(`${this.apiUrl}/accounts/${address.toString()}`),
      );
      return data.shard as number;
    } catch (err) {
      console.error('ERROR:', err);
      throw err;
    }
  }
  async getESDT_Data() {
    const data = await this.prisma.esdt.findMany({
      include: {
        assets: {
          include: {
            social: true,
          },
        },
      },
    });
    return data;
  }
}
