import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { GalleryImage } from './gallery.entity';

@Injectable()
export class GalleryService {
  constructor(
    @InjectRepository(GalleryImage)
    private readonly repo: Repository<GalleryImage>,
  ) {}

  findAll(showOnHome?: boolean): Promise<GalleryImage[]> {
    return this.repo.find({
      where: showOnHome ? { showOnHome: true } : undefined,
      order: { sortOrder: 'ASC', createdAt: 'ASC' },
    });
  }

  async create(dto: { url: string; caption?: string; sortOrder?: number }): Promise<GalleryImage> {
    const maxOrder = await this.repo.maximum('sortOrder') ?? -1;
    const image = this.repo.create({
      url: dto.url,
      caption: dto.caption ?? null,
      sortOrder: dto.sortOrder ?? (maxOrder as number) + 1,
    });
    return this.repo.save(image);
  }

  async update(id: string, dto: { caption?: string | null; sortOrder?: number; showOnHome?: boolean }): Promise<GalleryImage> {
    const image = await this.findOne(id);
    if (dto.caption !== undefined) image.caption = dto.caption;
    if (dto.sortOrder !== undefined) image.sortOrder = dto.sortOrder;
    if (dto.showOnHome !== undefined) image.showOnHome = dto.showOnHome;
    return this.repo.save(image);
  }

  async remove(id: string): Promise<void> {
    const image = await this.findOne(id);
    await this.repo.remove(image);
    // Clean up file from disk — url is like /uploads/filename.jpg
    const filename = image.url.replace(/^\/uploads\//, '');
    const filepath = join(process.cwd(), 'uploads', filename);
    await unlink(filepath).catch(() => undefined);
  }

  private async findOne(id: string): Promise<GalleryImage> {
    const image = await this.repo.findOne({ where: { id } });
    if (!image) throw new NotFoundException('Gallery image not found');
    return image;
  }
}
