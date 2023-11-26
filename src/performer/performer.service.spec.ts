/* eslint-disable prettier/prettier */
import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { PerformerEntity } from './performer.entity';
import { PerformerService } from './performer.service';

describe('PerformerService', () => {
  let service: PerformerService;
  let repository: Repository<PerformerEntity>;
  let performerList: PerformerEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PerformerService],
    }).compile();

    service = module.get<PerformerService>(PerformerService);
    repository = module.get<Repository<PerformerEntity>>(getRepositoryToken(PerformerEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    performerList = [];

    
    for (let i = 0; i < 2; i++) {
      const performer: PerformerEntity = await repository.save({
        nombre: faker.person.firstName(),
        imagen: faker.image.url(),
        descripcion: faker.person.jobDescriptor(),
      });
      performerList.push(performer);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create should create a new performer', async () => {
    const newPerformer: PerformerEntity = await service.create({
      id: faker.string.uuid(),
      nombre: faker.person.firstName(),
      imagen: faker.image.url(),
      descripcion: faker.person.jobDescriptor(),
      albums: []
    });
    expect(newPerformer).not.toBeNull();
    expect(newPerformer.nombre).not.toBeNull();
    expect(newPerformer.imagen).not.toBeNull();
    expect(newPerformer.descripcion).not.toBeNull();
  });

  it('create should thorw an excpetion because an invalidad description lenght', async () => {
    const newPerformer: PerformerEntity = {
      id: faker.string.uuid(),
      nombre: faker.person.firstName(),
      imagen: faker.image.url(),
      descripcion: faker.string.sample(101),
      albums: []
    };
    await expect(() => service.create(newPerformer)).rejects.toHaveProperty("message","La descripcion no puede tener mas de 100 caracteres")
  });

  it('findAll should return all performers', async () => {
    const performers: PerformerEntity[] = await service.findAll();
    expect(performers).not.toBeNull();
    expect(performers).toHaveLength(performerList.length);
  });

  it('findOne should return one performer', async () => {
    const storedPerformer: PerformerEntity = performerList[0];
    const performer: PerformerEntity = await service.findOne(storedPerformer.id);
    expect(performer).not.toBeNull();
    expect(performer.nombre).toEqual(storedPerformer.nombre);
    expect(performer.imagen).toEqual(storedPerformer.imagen);
    expect(performer.descripcion).toEqual(storedPerformer.descripcion);
  });

  it('findOne should throw an exception for an invalid performer', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "No se encontro un performer con el id:  0")
  });

});