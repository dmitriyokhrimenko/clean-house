import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking, BookingStatus, PropertyType, CleaningType } from './booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly repo: Repository<Booking>,
  ) {}

  create(dto: CreateBookingDto): Promise<Booking> {
    const booking = this.repo.create({
      name: dto.name,
      phone: dto.phone,
      email: dto.email,
      propertyType: dto.propertyType as PropertyType,
      cleaningType: dto.cleaningType as CleaningType,
      status: 'new' as BookingStatus,
      hasPets: dto.hasPets ?? false,
      bedrooms: dto.bedrooms ?? null,
      bathrooms: dto.bathrooms ?? null,
      squareFootage: dto.squareFootage ?? null,
      preferredDate: dto.preferredDate ?? null,
      calgaryArea: dto.calgaryArea ?? null,
      extraServices: dto.extraServices ?? null,
      message: dto.message ?? null,
      photos: dto.photos ?? null,
      adminNotes: null,
    });
    return this.repo.save(booking) as Promise<Booking>;
  }

  findAll(status?: string, page = 1, limit = 20): Promise<[Booking[], number]> {
    const qb = this.repo.createQueryBuilder('b').orderBy('b.createdAt', 'DESC');
    if (status) qb.where('b.status = :status', { status });
    qb.skip((page - 1) * limit).take(limit);
    return qb.getManyAndCount();
  }

  async findOne(id: string): Promise<Booking> {
    const booking = await this.repo.findOne({ where: { id } });
    if (!booking) throw new NotFoundException('Booking not found');
    return booking;
  }

  async update(id: string, dto: UpdateBookingDto): Promise<Booking> {
    const booking = await this.findOne(id);
    if (dto.status) booking.status = dto.status as BookingStatus;
    if (dto.adminNotes !== undefined) booking.adminNotes = dto.adminNotes;
    return this.repo.save(booking);
  }

  async remove(id: string): Promise<void> {
    const booking = await this.findOne(id);
    await this.repo.remove(booking);
  }

  async getStats() {
    const total = await this.repo.count();
    const byStatus = await this.repo
      .createQueryBuilder('b')
      .select('b.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('b.status')
      .getRawMany() as { status: string; count: string }[];

    const now = new Date();
    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const monthAgo = new Date(now);
    monthAgo.setDate(monthAgo.getDate() - 30);

    const thisWeek = await this.repo
      .createQueryBuilder('b')
      .where('b.createdAt >= :date', { date: weekAgo })
      .getCount();

    const thisMonth = await this.repo
      .createQueryBuilder('b')
      .where('b.createdAt >= :date', { date: monthAgo })
      .getCount();

    const recent = await this.repo.find({
      order: { createdAt: 'DESC' },
      take: 5,
    });

    return { total, byStatus, thisWeek, thisMonth, recent };
  }
}
