/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/buisness-errors';
import { Repository } from 'typeorm';
import { PerformerEntity } from './performer.entity';

@Injectable()
export class PerformerService {

    constructor(
        @InjectRepository(PerformerEntity)
        private readonly performerRepository: Repository<PerformerEntity>
    ) { }

    async create(performer: PerformerEntity): Promise<PerformerEntity> {
        if (performer.descripcion.length > 100) {
            throw new BusinessLogicException('La descripcion no puede tener mas de 100 caracteres', BusinessError.BAD_REQUEST);
        }
        return await this.performerRepository.save(performer);
    }

    async findOne(id: string): Promise<PerformerEntity> {
        const performer: PerformerEntity = await this.performerRepository.findOne({
            where: { id }, relations:
                ["albums"]
        });

        if (!performer) {
            throw new BusinessLogicException('No se encontro un performer con el id:  ' + id, BusinessError.NOT_FOUND);
        }
        return performer;
    }
    
    async findAll(): Promise<PerformerEntity[]> {
        return await this.performerRepository.find();
    }
}
