import { IAddress } from '@multiversx/sdk-core/out';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import axios from 'axios';
import { PrismaService } from 'src/prisma/prisma.service';
import { ESDT, ESDTValue } from 'src/prisma/prisma.types';
import { DEVNET_ESDT, MAINNET_ESDT } from '../mvx.config';
import { MvxService } from '../mvx.service';
import { rateLimitedApiCall } from '../rateLimiter';

@Injectable()
export class TokensService {
  private readonly apiUrl: string;

  constructor(
    private prisma: PrismaService,
    private mvxService: MvxService,
  ) {
    this.apiUrl = this.mvxService.getApiUrl(); // Use MvxService to get the API URL
  }

  async onModuleInit() {
    console.log('Initializing Token Service');
    this.handleCronMinute();
    this.handleCron10Minute();
  }

  @Cron(CronExpression.EVERY_MINUTE, { name: 'Refresh Token Data' })
  async handleCronMinute() {
    try {
    } catch (err) {
      console.error('ERROR:', err);
    }
  }

  @Cron(CronExpression.EVERY_10_MINUTES, {
    name: 'Refresh Token Data 10 Minutes',
  })
  async handleCron10Minute() {
    this.updateESDTs();
    try {
    } catch (err) {
      console.error('ERROR:', err);
    }
  }

  async updateESDTs() {
    console.log('Updating ESDTs in MVX Service');
    try {
      // Map over the ESDTs and create an array of promises using the rate limiter
      const esdtInfosRaw = this.getESDTS().map(async (esdt) => {
        const { data } = await rateLimitedApiCall(
          async () => await axios.get(`${this.apiUrl}/tokens/${esdt}`),
        );
        return data as ESDT;
      });

      const esdtInfos = await Promise.all(esdtInfosRaw).then((esdtInfos) =>
        this.prisma.setESDTs(esdtInfos),
      );
      return esdtInfos;
    } catch (err) {
      console.error('ERROR updating ESDTs:', err);
    }
  }

  getESDTS() {
    return (
      this.mvxService.getNetwork() === 'mainnet' ? MAINNET_ESDT : DEVNET_ESDT
    ) as string[];
  }

  async getESDTForAddress(address: IAddress): Promise<ESDTValue[]> {
    try {
      // Map over the ESDTs and create an array of promises using the rate limiter
      const requests = this.getESDTS().map(async (esdtId) => {
        const url = `${
          this.apiUrl
        }/accounts/${address.toString()}/tokens?identifier=${esdtId}&includeMetaESDT=false`;
        const data = await rateLimitedApiCall(
          async () => await axios.get(url).then((response) => response.data),
        );
        return data;
      });
      const responses = await Promise.all(requests);

      // Process the responses
      const esdtsData: ESDTValue[] = responses
        .filter((response) => response && response.length > 0) // Filter out empty or invalid responses
        .map((response) => {
          return {
            identifier: response[0].identifier,
            balance: response[0].balance,
          };
        });

      return esdtsData; // Return the processed ESDT values
    } catch (err) {
      console.error('ERROR fetching ESDT values:', err);
      throw err; // Rethrow the error after logging
    }
  }
}
