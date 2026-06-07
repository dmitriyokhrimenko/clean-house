import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { AppSettings } from './settings.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  get() {
    return this.settingsService.get();
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  update(@Body() body: Partial<Omit<AppSettings, 'id' | 'updatedAt'>>) {
    return this.settingsService.update(body);
  }
}
