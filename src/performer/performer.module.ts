import { Module } from '@nestjs/common';
import { PerformerService } from './performer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PerformerEntity } from './performer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PerformerEntity])],
  providers: [PerformerService]
})
export class PerformerModule {}
