/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { AlbumEntity } from '../album/album.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { TrackDto } from './track.dto';
import { TrackEntity } from './track.entity';
import { TrackService } from './track.service';

@Controller('tracks')
@UseInterceptors(BusinessErrorsInterceptor)
export class TrackController {
    constructor(
        private readonly trackService: TrackService,
    ) { }
    
    @Get()
    async findAll() {
        return await this.trackService.findAll();
    }

    @Get(':trackId')
    async findOne(@Param('trackId') trackId: string) {
        return await this.trackService.findOne(trackId);
    }

    @Post()
    async create(@Body() trackDto: TrackDto) {
        const track: TrackEntity = plainToInstance(TrackEntity, trackDto)
        const album: AlbumEntity = plainToInstance(AlbumEntity, trackDto.album);
        return await this.trackService.create(album.id,track);
    }
}
