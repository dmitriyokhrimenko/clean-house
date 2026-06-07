import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PageView } from './page-view.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(PageView)
    private readonly repo: Repository<PageView>,
  ) {}

  track(dto: { path: string; ip?: string; userAgent?: string; referrer?: string; sessionId?: string }): Promise<PageView> {
    return this.repo.save(this.repo.create({
      path: dto.path,
      ip: dto.ip ?? null,
      userAgent: dto.userAgent ?? null,
      referrer: dto.referrer ?? null,
      sessionId: dto.sessionId ?? null,
    }));
  }

  async getStats() {
    const now = new Date();

    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const monthAgo = new Date(now);
    monthAgo.setDate(monthAgo.getDate() - 30);

    const countDistinct = (from: Date | null = null) =>
      this.repo.createQueryBuilder('v')
        .select('COUNT(DISTINCT v.sessionId)', 'count')
        .where(from ? 'v.createdAt >= :date' : '1=1', from ? { date: from } : {})
        .getRawOne<{ count: string }>()
        .then((r) => parseInt(r?.count ?? '0'));

    const [total, today, thisWeek, thisMonth, topPages, recentVisits] = await Promise.all([
      countDistinct(),
      countDistinct(startOfToday),
      countDistinct(weekAgo),
      countDistinct(monthAgo),

      this.repo.createQueryBuilder('v')
        .select('v.path', 'path')
        .addSelect('COUNT(*)', 'count')
        .groupBy('v.path')
        .orderBy('count', 'DESC')
        .limit(10)
        .getRawMany() as Promise<{ path: string; count: string }[]>,

      this.repo.find({
        order: { createdAt: 'DESC' },
        take: 20,
        select: ['id', 'path', 'referrer', 'createdAt'],
      }),
    ]);

    return { total, today, thisWeek, thisMonth, topPages, recentVisits };
  }
}
