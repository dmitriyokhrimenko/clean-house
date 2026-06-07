import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('gallery_images')
export class GalleryImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  url: string;

  @Column({ nullable: true, type: 'varchar' })
  caption: string | null;

  @Column({ default: 0 })
  sortOrder: number;

  @Column({ default: false })
  showOnHome: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
