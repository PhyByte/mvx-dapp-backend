import { Address } from '@multiversx/sdk-core/out';
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { BearerAuthGuard, CustomRequest } from 'src/guards/bearer-auth.guard';
import { WalletService } from './wallet.service';

@Controller('wallet')
export class WalletController {
  constructor(private walletService: WalletService) {}

  // Update the entire wallet
  @UseGuards(BearerAuthGuard)
  @Get('/update')
  async getWallet(@Req() request: CustomRequest) {
    const wallet = await this.walletService.refreshWallet(
      new Address(request.address),
    );
    return wallet;
  }

  
}
