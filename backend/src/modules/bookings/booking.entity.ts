import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export type PropertyType = 'house' | 'condo' | 'apartment' | 'office';
export type CleaningType = 'regular' | 'deep' | 'move-in-out';
export type BookingStatus = 'new' | 'contacted' | 'confirmed' | 'completed' | 'cancelled';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column({ type: 'varchar' })
  propertyType: PropertyType;

  @Column({ nullable: true, type: 'int' })
  bedrooms: number | null;

  @Column({ nullable: true, type: 'float' })
  bathrooms: number | null;

  @Column({ nullable: true, type: 'varchar' })
  squareFootage: string | null;

  @Column({ type: 'varchar' })
  cleaningType: CleaningType;

  @Column({ type: 'date', nullable: true })
  preferredDate: string | null;

  @Column({ nullable: true, type: 'varchar' })
  calgaryArea: string | null;

  @Column({ type: 'simple-array', nullable: true })
  extraServices: string[] | null;

  @Column({ default: false })
  hasPets: boolean;

  @Column({ type: 'text', nullable: true })
  message: string | null;

  @Column({ type: 'simple-array', nullable: true })
  photos: string[] | null;

  @Column({ type: 'varchar', default: 'new' })
  status: BookingStatus;

  @Column({ type: 'text', nullable: true })
  adminNotes: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
