import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PageView } from './page-view.entity';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PageView])],
  providers: [AnalyticsService],
  controllers: [AnalyticsController],
})
export class AnalyticsModule {}
