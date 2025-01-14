import { Address } from '@multiversx/sdk-core/out';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { MvxService } from 'src/mvx/mvx.service';
import { TokensService } from 'src/mvx/tokens/tokens.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WalletService {
  constructor(
    private readonly mvx: MvxService,
    private readonly tokens: TokensService,
    private readonly prisma: PrismaService,
  ) {}

  async onModuleInit() {
    this.handleCron(); // Initial data fetch
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    try {
    } catch (err) {}
  }

  async listAllWallet() {
    const wallet = await this.prisma.wallet.findMany();
    return wallet;
  }

  async refreshWallet(address: Address) {
    try {
      // Get or create the user wallet
      let wallet = await this.prisma.getOrCreateWallet(address.toString());
      if (wallet.shard === 10) {
        const shard = await this.mvx.getShardForAddress(address);
        await this.prisma.wallet.update({
          where: { address: address.toString() },
          data: { shard: shard },
        });
      }
      if (
        wallet.balance === '-1' ||
        wallet.updatedAt < new Date(Date.now() - 5000)
      ) {
        // ----------------- 1. EGLD BALANCE -----------------
        const { balance, heroTag } =
          await this.mvx.getBalanceAndHerotagForAddress(address.toString());
        // Update wallet balance and herotag
        //remove the 7 character at the end of herotag
        const wallet = await this.prisma.wallet.update({
          where: { address: address.toString() },
          data: {
            balance: balance,
            herotag: heroTag.slice(0, -7),
          },
        });
        // ----------------- 2. ESDT -----------------
        await this.refreshTokens(address, wallet.id);

        return this.prisma.wallet.findUnique({
          where: { address: address.toString() },
          select: {
            balance: true,
            herotag: true,
            shard: true,
            esdt: true,
          },
        });
      } else {
        // Return unmodified wallet
        return wallet;
      }
    } catch (e) {
      console.error('Error updating user:', e);
    }
  }

  async refreshTokens(
    address: Address, // The address of the wallet to update tokens for.
    walletId: number, // The ID of the wallet to update tokens for.
  ) {
    let esdtValues = await this.tokens.getESDTForAddress(address);
    // Process ESDT values
    const existingEsdtRecords = await this.prisma.wallet_Esdt.findMany({
      where: { walletId: walletId },
    });
    for (const esdtValue of esdtValues) {
      const existingRecord = existingEsdtRecords.find(
        (e) => e.identifier === esdtValue.identifier,
      );
      if (existingRecord) {
        // Update existing record
        await this.prisma.wallet_Esdt.update({
          where: { id: existingRecord.id },
          data: { balance: esdtValue.balance },
        });
      } else {
        // Create new record
        await this.prisma.wallet_Esdt.create({
          data: {
            identifier: esdtValue.identifier,
            balance: esdtValue.balance,
            walletId: walletId,
          },
        });
      }
    }

    // Delete records for tokens not returned in esdtValues
    const activeIdentifiers = new Set(
      esdtValues.map((value) => value.identifier),
    );
    const recordsToDelete = existingEsdtRecords.filter(
      (record) => !activeIdentifiers.has(record.identifier),
    );
    for (const record of recordsToDelete) {
      await this.prisma.wallet_Esdt.delete({
        where: { id: record.id },
      });
    }
  }
}
