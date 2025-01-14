import * as Joi from '@hapi/joi';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { CommonController } from './common/common.controller';
import { CommonModule } from './common/common.module';
import { MvxModule } from './mvx/mvx.module';
import { PrismaModule } from './prisma/prisma.module';
import { WalletModule } from './wallet/wallet.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 30,
      },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        NETWORK: Joi.string().valid('mainnet', 'devnet').required(),
      }),
    }),
    ScheduleModule.forRoot(),
    MvxModule,
    AuthModule,
    WalletModule,
    PrismaModule,
    CommonModule,
  ],
  controllers: [CommonController],
  providers: [],
})
export class AppModule {}
