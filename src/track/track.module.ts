import { Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackEntity } from './track.entity';
import { AlbumEntity } from 'src/album/album.entity';
import { TrackController } from './track.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TrackEntity, AlbumEntity])],
  providers: [TrackService],
  controllers: [TrackController]
})
export class TrackModule {}
