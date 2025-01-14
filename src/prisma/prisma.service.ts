import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import {
  Mvx_Constants,
  Mvx_Economics,
  Mvx_Stats,
  PrismaClient,
  Token_Type,
} from '@prisma/client';
import axios from 'axios';
import { ESDT } from './prisma.types';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect(); // Connect to the database when the module is initialized
  }

  async onModuleDestroy() {
    await this.$disconnect(); // Cleanly disconnect from the database when the module is destroyed
  }

  //--------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------
  //                                    MULTIVERS X
  //--------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------

  //-------    MVX Constants
  getMvx_Constants() {
    return this.mvx_Constants.findFirst();
  }
  async setMvx_Constants(constantsData: Mvx_Constants) {
    if (constantsData !== undefined) {
      await this.mvx_Constants.upsert({
        where: { id: 1 },
        update: constantsData,
        create: constantsData,
      });
    } else {
      console.log('No MVX Constants data to update');
    }
  }

  //-------    MVX Economics
  async getMVX_Economics() {
    return await this.mvx_Economics.findFirst();
  }
  async setMVX_Economics(economicsData: Mvx_Economics) {
    if (economicsData !== undefined) {
      if (economicsData.price === undefined) {
        var newEconomicsDAta = economicsData;
        const egldpricefromcoingecko = await axios.get(
          'https://api.coingecko.com/api/v3/simple/price?ids=elrond-erd-2&vs_currencies=usd',
        );
        newEconomicsDAta.price =
          egldpricefromcoingecko.data['elrond-erd-2'].usd;
        const marketcap = await axios.get(
          'https://api.coingecko.com/api/v3/coins/elrond-erd-2',
        );
        newEconomicsDAta.marketCap = Number(
          marketcap.data.market_data.market_cap.usd,
        );
        await this.mvx_Economics.upsert({
          where: { id: 1 },
          update: newEconomicsDAta,
          create: newEconomicsDAta,
        });
      } else {
        await this.mvx_Economics.upsert({
          where: { id: 1 },
          update: economicsData,
          create: economicsData,
        });
      }
    } else {
      console.log('No MVX Economics data to update');
    }
  }

  //-------    MVX Stats
  getMVX_Stats() {
    return this.mvx_Stats.findFirst();
  }
  async setMVX_Stats(statsData: Mvx_Stats) {
    if (statsData !== undefined) {
      await this.mvx_Stats.upsert({
        where: { id: 1 },
        update: statsData,
        create: statsData,
      });
    } else {
      console.log('No MVX Stats data to update');
    }
  }

  async getOrCreateWallet(address: string) {
    // Try to find the wallet by address
    const wallet = await this.wallet.findUnique({
      where: { address: address },
      select: {
        id: true,
        address: true,
        shard: true,
        updatedAt: true,
        balance: true,
        esdt: true,
      },
    });

    // If the wallet already exists, return it
    if (wallet) {
      return wallet;
    }

    // If the wallet doesn't exist, create a new one
    const newWallet = await this.wallet.create({
      data: {
        address: address,
        herotag: '',
        shard: 10,
        balance: '-1',
        bearerToken: '', // Assuming initial bearerToken is empty
      },
      select: {
        id: true,
        address: true,
        shard: true,
        updatedAt: true,
        balance: true,
      },
    });

    return newWallet;
  }
  async setESDTs(esdtInfos: ESDT[]) {
    try {
      for (let esdt of esdtInfos) {
        // Find if there is an existing ESDT record
        let esdtRecord: ESDT = await this.esdt.upsert({
          where: { identifier: esdt.identifier },
          update: {
            identifier: esdt.identifier,
            name: esdt.name,
            ticker: esdt.ticker,
            owner: esdt.owner,
            minted: esdt.minted,
            burnt: esdt.burnt,
            initialMinted: esdt.initialMinted,
            decimals: esdt.decimals,
            isPaused: esdt.isPaused,
            assets: {
              update: {
                website: esdt.assets?.website || '',
                description: esdt.assets.description || '',
                status: esdt.assets.status || 'active',
                pngUrl: esdt.assets.pngUrl || '',
                svgUrl: esdt.assets.svgUrl || '',
                social: {
                  update: {
                    blog: esdt.assets.social?.blog || '',
                    telegram: esdt.assets.social?.telegram || '',
                    twitter: esdt.assets.social?.twitter || '',
                    whitepaper: esdt.assets.social?.whitepaper || '',
                    email: esdt.assets.social?.email || '',
                    coinmarketcap: esdt.assets.social?.coinmarketcap || '',
                    coingecko: esdt.assets.social?.coingecko || '',
                  },
                },
              },
            },
            transactions: esdt.transactions,
            accounts: esdt.accounts,
            canUpgrade: esdt.canUpgrade,
            canMint: esdt.canMint,
            canBurn: esdt.canBurn,
            canChangeOwner: esdt.canChangeOwner,
            canAddSpecialRoles: esdt.canAddSpecialRoles,
            canPause: esdt.canPause,
            canFreeze: esdt.canFreeze,
            canWipe: esdt.canWipe,
            canTransfer: esdt.canTransfer,
            canTransferNftCreateRole: esdt.canTransferNftCreateRole,
            price: esdt.price,
            marketCap: esdt.marketCap,
            supply: esdt.supply,
            circulatingSupply: esdt.circulatingSupply,
            type: Token_Type.FungibleESDT,
          },
          create: {
            identifier: esdt.identifier,
            name: esdt!.name || '',
            ticker: esdt.ticker,
            owner: esdt.owner,
            minted: esdt.minted,
            burnt: esdt.burnt,
            initialMinted: esdt.initialMinted,
            decimals: esdt.decimals,
            isPaused: esdt.isPaused,
            assets: {
              create: {
                website: esdt.assets?.website || '',
                description: esdt.assets.description || '',
                status: esdt.assets.status || 'active',
                pngUrl: esdt.assets.pngUrl || '',
                svgUrl: esdt.assets.svgUrl || '',
                social: {
                  create: {
                    blog: esdt.assets.social?.blog || '',
                    telegram: esdt.assets.social?.telegram || '',
                    twitter: esdt.assets.social?.twitter || '',
                    whitepaper: esdt.assets.social?.whitepaper || '',
                    email: esdt.assets.social?.email || '',
                    coinmarketcap: esdt.assets.social?.coinmarketcap || '',
                    coingecko: esdt.assets.social?.coingecko || '',
                  },
                },
              },
            },
            transactions: esdt.transactions,
            accounts: esdt.accounts,
            canUpgrade: esdt.canUpgrade,
            canMint: esdt.canMint,
            canBurn: esdt.canBurn,
            canChangeOwner: esdt.canChangeOwner,
            canAddSpecialRoles: esdt.canAddSpecialRoles,
            canPause: esdt.canPause,
            canFreeze: esdt.canFreeze,
            canWipe: esdt.canWipe,
            canTransfer: esdt.canTransfer,
            canTransferNftCreateRole: esdt.canTransferNftCreateRole,
            price: esdt.price,
            marketCap: esdt.marketCap,
            supply: esdt.supply,
            circulatingSupply: esdt.circulatingSupply,
            type: Token_Type.FungibleESDT,
          },
        });
      }
      return esdtInfos;
    } catch (err) {
      console.error('ERROR:' + err);
      throw err;
    }
  }
}
