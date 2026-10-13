import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'inventory' })
export class InventoryEntity {
  @PrimaryColumn({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @PrimaryColumn({ name: 'item_key', length: 100 })
  itemKey!: string;

  @Column({ type: 'integer', default: 0 })
  quantity!: number;
}