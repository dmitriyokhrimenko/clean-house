import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('page_views')
export class PageView {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  path: string;

  @Column({ nullable: true, type: 'varchar' })
  ip: string | null;

  @Column({ nullable: true, type: 'varchar', length: 500 })
  userAgent: string | null;

  @Column({ nullable: true, type: 'varchar' })
  referrer: string | null;

  @Column({ nullable: true, type: 'varchar' })
  sessionId: string | null;

  @CreateDateColumn()
  createdAt: Date;
}
