import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Product Entity
 * Represents a pharmaceutical product in the inventory
 */
@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  nombre: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio: number;

  @Column({ type: 'text' })
  descripcion: string;

  @Column({ type: 'timestamp', name: 'fecha_elaboracion' })
  fechaElaboracion: Date;

  @Column({ type: 'timestamp', name: 'fecha_vencimiento' })
  fechaVencimiento: Date;

  @Column({ type: 'varchar', length: 500, nullable: true })
  imagen?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
