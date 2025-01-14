import { Module } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [TokensService, PrismaService],
  exports: [TokensService],
})
export class TokensModule {}
