import { Global, Module } from '@nestjs/common';
import { MvxController } from './mvx.controller';
import { MvxService } from './mvx.service';
import { TokensModule } from './tokens/tokens.module';

@Global()
@Module({
  controllers: [MvxController],
  providers: [MvxService],
  exports: [MvxService],
  imports: [TokensModule],
})
export class MvxModule {}
