import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppSettings } from './settings.entity';

@Injectable()
export class SettingsService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(AppSettings)
    private readonly repo: Repository<AppSettings>,
  ) {}

  async onApplicationBootstrap() {
    const existing = await this.repo.findOne({ where: { id: 1 } });
    if (!existing) {
      await this.repo.save(this.repo.create({ id: 1 }));
    }
  }

  get(): Promise<AppSettings> {
    return this.repo.findOneOrFail({ where: { id: 1 } });
  }

  async update(dto: Partial<Omit<AppSettings, 'id' | 'updatedAt'>>): Promise<AppSettings> {
    await this.repo.update({ id: 1 }, dto);
    return this.get();
  }
}
