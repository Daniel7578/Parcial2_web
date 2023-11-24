/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/buisness-errors';
import { Repository } from 'typeorm';
import { AlbumEntity } from './album.entity';

@Injectable()
export class AlbumService {

    constructor(
        @InjectRepository(AlbumEntity)
        private readonly albumRepository: Repository<AlbumEntity>
    ) { }

    async create(album: AlbumEntity): Promise<AlbumEntity> {
        if (!album.descripcion) {
            throw new BusinessLogicException('La descripcion no puede estar vacia', BusinessError.BAD_REQUEST);
        }
        if (!album.nombre) {
            throw new BusinessLogicException('El nombre no puede estar vacio', BusinessError.BAD_REQUEST);
        }
        return await this.albumRepository.save(album);
    }


    async findOne(id: string): Promise<AlbumEntity> {
        const album: AlbumEntity = await this.albumRepository.findOne({
            where: { id }, relations:
                ["performers", "tracks"]
        });

        if (!album) {
            throw new BusinessLogicException('No existe el album con el albumId: ' + id, BusinessError.NOT_FOUND);
        }
        return album;
    }
    async findAll(): Promise<AlbumEntity[]> {
        return await this.albumRepository.find({ relations: ["performers", "tracks"] });
    }

    async delete(id: string): Promise<void> {
        const album: AlbumEntity = await this.albumRepository.findOne({ where: { id }, relations: ['tracks']});
        if (!album) {
            throw new BusinessLogicException('El album con el id proporcionado no fue encontrado', BusinessError.NOT_FOUND);
        }
        if (album.tracks.length > 0) {
            throw new BusinessLogicException('No se puede eliminar el album porque tiene pistas asociadas', BusinessError.PRECONDITION_FAILED);
        }
        await this.albumRepository.delete(id);
    }
}
