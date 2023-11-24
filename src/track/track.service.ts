import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TrackEntity } from './track.entity';
import { Repository } from 'typeorm';
import { AlbumEntity } from '../album/album.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/buisness-errors';

@Injectable()
export class TrackService {
    constructor (
        @InjectRepository(TrackEntity)
        private readonly trackRepository: Repository<TrackEntity>,
        
        @InjectRepository(AlbumEntity)
        private readonly albumTrackRepository: Repository<AlbumEntity>
    ) {}
    async create(albumId: string,track: TrackEntity): Promise<TrackEntity> {
        const album: AlbumEntity = await this.albumTrackRepository.findOne({ where: { id: albumId } });
        if (!album)
            throw new BusinessLogicException("No se encontro un album con el id proporcionado:", BusinessError.NOT_FOUND);
        if (track.duracion <= 0){
            throw new BusinessLogicException("La duracion no puede ser negativa", BusinessError.BAD_REQUEST);
        }
        return await this.trackRepository.save(track);
    }

    async findOne(id: string): Promise<TrackEntity> {
        const track: TrackEntity = await this.trackRepository.findOne({ where: { id } });
        if (!track) {
            throw new BusinessLogicException('No se enoontró un track con el id proporcionado ' + id, BusinessError.NOT_FOUND);
        }
        return track;
    }

    async findAll(): Promise<TrackEntity[]> {
        return await this.trackRepository.find();
    }
}
