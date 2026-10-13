import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryEntity } from './infrastructure/persistence/inventory.entity';

@Module({ imports: [TypeOrmModule.forFeature([InventoryEntity])] })
export class InventoryModule {}