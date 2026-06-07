import { Controller, Post, Get, Body, Req, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Request } from 'express';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Throttle({ global: { ttl: 60000, limit: 60 } })
  @Post('pageview')
  track(
    @Body() body: { path: string; referrer?: string; sessionId?: string },
    @Req() req: Request,
  ) {
    const ip =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ??
      req.ip ??
      null;
    return this.analyticsService.track({
      path: body.path,
      ip,
      userAgent: req.headers['user-agent'],
      referrer: body.referrer,
      sessionId: body.sessionId,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('stats')
  stats() {
    return this.analyticsService.getStats();
  }
}
