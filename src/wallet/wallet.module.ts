import { Module } from '@nestjs/common';
import { TokensModule } from 'src/mvx/tokens/tokens.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';

@Module({
  imports: [TokensModule], // Import modules required by WalletService
  controllers: [WalletController], // Provide WalletController
  providers: [WalletService, PrismaService], // Provide WalletService and other dependencies
  exports: [WalletService], // Export WalletService for use in other modules
})
export class WalletModule {}
