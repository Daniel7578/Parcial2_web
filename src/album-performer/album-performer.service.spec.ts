/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { AlbumEntity } from '../album/album.entity';
import { PerformerEntity } from '../performer/performer.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { AlbumPerformerService } from './album-performer.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('AlbumPerformerService', () => {
  let service: AlbumPerformerService;
  let albumRepository: Repository<AlbumEntity>;
  let performerRepository: Repository<PerformerEntity>;
  let album: AlbumEntity;
  let performersList : PerformerEntity[];
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AlbumPerformerService],
    }).compile();

    service = module.get<AlbumPerformerService>(AlbumPerformerService);
    albumRepository = module.get<Repository<AlbumEntity>>(getRepositoryToken(AlbumEntity));
    performerRepository = module.get<Repository<PerformerEntity>>(getRepositoryToken(PerformerEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    performerRepository.clear();
    albumRepository.clear();
    performersList = [];
    for(let i = 0; i < 5; i++){
        const performer: PerformerEntity = await performerRepository.save({
          nombre: faker.person.firstName(),
          imagen: faker.image.url(),
          descripcion: faker.person.jobDescriptor(),
        });
        performersList.push(performer);
    }

    album = await albumRepository.save({
      nombre: faker.music.songName(),
      fechaLanzamiento: faker.date.past(),
      descripcion: faker.lorem.sentence(),
      caratula: faker.image.url(),
      performs: performersList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addPerformerAlbum should add a performer to an album', async () => {
    const newPerformer: PerformerEntity = await performerRepository.save({
      nombre: faker.person.firstName(),
      imagen: faker.image.url(),
      descripcion: faker.person.jobDescriptor(),
    });
      const performers: PerformerEntity[] = [];
      performers.push(newPerformer);

    const newAlbum: AlbumEntity = await albumRepository.save({
      nombre: faker.music.songName(),
      fechaLanzamiento: faker.date.past(),
      descripcion: faker.lorem.sentence(),
      caratula: faker.image.url(),
      performs: []
    })

    const result: AlbumEntity = await service.addPerformerToAlbum(newAlbum.id, newPerformer.id);
    
    expect(result.performers.length).toBe(1);
    expect(result.performers[0].nombre).toBe(newPerformer.nombre);

  });

  it('addPerformerAlbum should thrown exception for an invalid performer', async () => {
    const newAlbum: AlbumEntity = await albumRepository.save({
      nombre: faker.music.songName(),
      fechaLanzamiento: faker.date.past(),
      descripcion: faker.lorem.sentence(),
      caratula: faker.image.url(),
      performs: performersList
    })

    await expect(() => service.addPerformerToAlbum(newAlbum.id, "0")).rejects.toHaveProperty("message", "No existe el performer con el id dado");
  });

  it('addPerformerAlbum should throw an exception for an invalid album', async () => {
    const newPerformer: PerformerEntity = await performerRepository.save({
      nombre: faker.person.firstName(),
      imagen: faker.image.url(),
      descripcion: faker.person.jobDescriptor(),
    });

    await expect(() => service.addPerformerToAlbum("0", newPerformer.id)).rejects.toHaveProperty("message", "No existe el album con el id dado");
  });

  it('addPerformerToAlbum should throw an excepcion for adding 3 or more performers to an album', async () => {
    const newPerformer: PerformerEntity = await performerRepository.save({
      nombre: faker.person.firstName(),
      imagen: faker.image.url(),
      descripcion: faker.person.jobDescriptor(),
    });
    const newPerformer2: PerformerEntity = await performerRepository.save({
      nombre: faker.person.firstName(),
      imagen: faker.image.url(),
      descripcion: faker.person.jobDescriptor(),
    });
    const newPerformer3: PerformerEntity = await performerRepository.save({
      nombre: faker.person.firstName(),
      imagen: faker.image.url(),
      descripcion: faker.person.jobDescriptor(),
    });
    const newPerformer4: PerformerEntity = await performerRepository.save({
      nombre: faker.person.firstName(),
      imagen: faker.image.url(),
      descripcion: faker.person.jobDescriptor(),
    });
    
    await service.addPerformerToAlbum(album.id, newPerformer.id);
    await service.addPerformerToAlbum(album.id, newPerformer2.id);
    await service.addPerformerToAlbum(album.id, newPerformer3.id);
    await expect(() => service.addPerformerToAlbum(album.id, newPerformer4.id)).rejects.toHaveProperty("message", "No es posible agregar mas performers");
  });

});