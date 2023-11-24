/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AlbumEntity } from '../album/album.entity';
import { PerformerEntity } from '../performer/performer.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/buisness-errors';
import { Repository } from 'typeorm';

@Injectable()
export class AlbumPerformerService {

    constructor(
        @InjectRepository(AlbumEntity)
        private readonly albumRepository: Repository<AlbumEntity>,
     
        @InjectRepository(PerformerEntity)
        private readonly performerRepository: Repository<PerformerEntity>
    ) {}

    async addPerformerToAlbum(albumId: string, performerId: string): Promise<AlbumEntity> {
        const performer: PerformerEntity = await this.performerRepository.findOne({where: {id: performerId}, relations:
            ["albums"]});
        if (!performer)
          throw new BusinessLogicException("No existe el performer con el id dado", BusinessError.NOT_FOUND);
       
        const album: AlbumEntity = await this.albumRepository.findOne({where: {id: albumId}, relations:
            ["performers","tracks"]});
        if (!album)
          throw new BusinessLogicException("No existe el album con el id dado", BusinessError.NOT_FOUND);
     
        if (album.performers.length >= 3){
            throw new BusinessLogicException("No es posible agregar mas performers", BusinessError.BAD_REQUEST);
        }
        album.performers = [...album.performers, performer];
        return await this.albumRepository.save(album);
      }
}
