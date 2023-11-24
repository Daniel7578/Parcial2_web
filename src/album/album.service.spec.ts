/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { AlbumEntity } from './album.entity';
import { AlbumService } from './album.service';
import { TrackEntity } from '../track/track.entity';

describe('AlbumService', () => {
  let service: AlbumService;
  let repository: Repository<AlbumEntity>;
  let repositoryTrack: Repository<TrackEntity>;
  let albumList: AlbumEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AlbumService],
    }).compile();

    service = module.get<AlbumService>(AlbumService);
    repository = module.get<Repository<AlbumEntity>>(getRepositoryToken(AlbumEntity));
    repositoryTrack = module.get<Repository<TrackEntity>>(getRepositoryToken(TrackEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    albumList = [];
    repositoryTrack.clear();

    for (let i = 0; i < 2; i++) {
      const album: AlbumEntity = await repository.save({
        nombre: faker.music.songName(),
        fechaLanzamiento: faker.date.past(),
        descripcion: faker.lorem.sentence(),
        caratula: faker.image.url(),
        performers: [],
        tracks: []
      });
      albumList.push(album);
    }

  };
  
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create should create a new album', async () => {
    const newAlbum: AlbumEntity = await service.create({
      id: faker.string.uuid(),
      nombre: faker.music.songName(),
      fechaLanzamiento: faker.date.past(),
      descripcion: faker.lorem.sentence(),
      caratula: faker.image.url(),
      performers: [],
      tracks: []
    });
    expect(newAlbum).not.toBeNull();
    expect(newAlbum.nombre).not.toBeNull();
    expect(newAlbum.descripcion).not.toBeNull();
    expect(newAlbum.caratula).not.toBeNull();
    expect(newAlbum.fechaLanzamiento).not.toBeNull();
  });

  it('should throw an error when the album description is null', async () => {
    const newAlbum: AlbumEntity = {
      id: faker.string.uuid(),
      nombre: faker.music.songName(),
      fechaLanzamiento: faker.date.past(),
      descripcion: "",
      caratula: faker.image.url(),
      performers: [],
      tracks: []
    };
    await expect(() => service.create(newAlbum)).rejects.toHaveProperty("message", "La descripcion no puede estar vacia");
  });
});

