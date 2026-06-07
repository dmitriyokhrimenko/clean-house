import { Entity, Column, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('app_settings')
export class AppSettings {
  @PrimaryColumn()
  id: number; // always 1 — single-row settings table

  @Column({ default: '(587) 123-4567' })
  phone: string;

  @Column({ default: 'info@cleanhouse.ca' })
  email: string;

  @Column({ default: 'Clean House' })
  businessName: string;

  @Column({ default: 'Calgary, Alberta' })
  location: string;

  @Column({ default: 'From $40/hr' })
  startingPrice: string;

  @Column({ nullable: true, type: 'varchar' })
  facebookUrl: string | null;

  @Column({ nullable: true, type: 'varchar' })
  googleBusinessUrl: string | null;

  @Column({ type: 'text', default: 'Thank you for reaching out! We will confirm your appointment within 24 hours.' })
  bookingConfirmationMessage: string;

  @UpdateDateColumn()
  updatedAt: Date;
}
