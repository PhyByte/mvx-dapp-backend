import { Module } from '@nestjs/common';
import { CommonController } from './common.controller';

/**
 * CommonModule defines the common functionalities used across the application.
 * It imports and declares controllers that handle requests like health checks and config display.
 */
@Module({
  controllers: [CommonController],
})
export class CommonModule {}