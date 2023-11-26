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
  it('should throw an error when the album name is null', async () => {
    const newAlbum: AlbumEntity = {
      id: faker.string.uuid(),
      nombre: "",
      fechaLanzamiento: faker.date.past(),
      descripcion: faker.lorem.sentence(),
      caratula: faker.image.url(),
      performers: [],
      tracks: []
    };
    await expect(() => service.create(newAlbum)).rejects.toHaveProperty("message", "El nombre no puede estar vacio");
  });

  it('findOne should return one album', async () => {
    const storedAlbum: AlbumEntity = albumList[0];
    const album: AlbumEntity = await service.findOne(storedAlbum.id);
    expect(album).not.toBeNull();
    expect(album.nombre).toEqual(storedAlbum.nombre);
    expect(album.fechaLanzamiento).toEqual(storedAlbum.fechaLanzamiento);
    expect(album.descripcion).toEqual(storedAlbum.descripcion);
    expect(album.caratula).toEqual(storedAlbum.caratula);
  });

  it('findOne should throw an exception for an invalid album', async () => {
    await expect(() => service.findOne("00000000-0000-0000-0000-000000000000")).rejects.toHaveProperty("message", "No existe el album con el albumId: 00000000-0000-0000-0000-000000000000")
  });

  it('findAll should return all albums', async () => {
    const albums: AlbumEntity[] = await service.findAll();
    expect(albums).not.toBeNull();
    expect(albums).toHaveLength(albumList.length);
  });

  it('delete should delete a album', async () => {
    const album: AlbumEntity = albumList[0];
    await service.delete(album.id);
    const deletedAlbum: AlbumEntity = await repository.findOne({ where: { id: album.id } });
    expect(deletedAlbum).toBeNull();
  });

  it('delete should throw an exception for an invalid album', async () => {
    await expect(() => service.delete('0')).rejects.toHaveProperty('message','El album con el id proporcionado no fue encontrado');
  });

it('delete should throw an exception for delete an album with track', async () => {
  const album: AlbumEntity = albumList[0];
  await repositoryTrack.save({
    id: faker.string.uuid(),
    nombre: faker.music.songName(),
    duracion: +faker.number.int(),
    album: album
  });

  await expect(() => service.delete(album.id)).rejects.toHaveProperty('message','No se puede eliminar el album porque tiene pistas asociadas');
  });
});

