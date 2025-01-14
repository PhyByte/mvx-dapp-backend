import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Export PrismaService so that it can be injected into other modules
})
export class PrismaModule {}
