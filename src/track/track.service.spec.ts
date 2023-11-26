/* eslint-disable prettier/prettier */
import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AlbumEntity } from '../album/album.entity';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { TrackEntity } from './track.entity';
import { TrackService } from './track.service';

describe('TrackService', () => {
  let service: TrackService;
  let repository: Repository<TrackEntity>;
  let repositoryAlbum: Repository<AlbumEntity>;
  let trackList: TrackEntity[];
  let album: AlbumEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [TrackService],
    }).compile();

    service = module.get<TrackService>(TrackService);
    repository = module.get<Repository<TrackEntity>>(getRepositoryToken(TrackEntity));
    repositoryAlbum = module.get<Repository<AlbumEntity>>(getRepositoryToken(AlbumEntity));
    await sendDatabase();
  });

  const sendDatabase = async () => {
    repository.clear();
    repositoryAlbum.clear();
    trackList = [];

    album = await repositoryAlbum.save({
        nombre: faker.music.songName(),
        fechaLanzamiento: faker.date.past(),
        descripcion: faker.lorem.sentence(),
        caratula: faker.image.url()
    });

    for (let i = 0; i < 2; i++) {
      const track: TrackEntity = await repository.save({
        nombre: faker.music.songName(),
        duracion: faker.number.int(),
        album: album
      });
      trackList.push(track);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  it('create should create a new track', async () => {
    const newTrack: TrackEntity = await service.create(album.id,{
      id: faker.string.uuid(),
      nombre: faker.music.songName(),
      duracion: faker.number.int(),
      album: album
    });
    expect(newTrack).not.toBeNull();
    expect(newTrack.nombre).not.toBeNull();
    expect(newTrack.duracion).not.toBeNull();
    expect(newTrack.album).not.toBeNull();
  });

  it('create should thorw an exception for create a Track with an invalid Album', async () => {
    const newTrack: TrackEntity = await repository.save({
      nombre: faker.music.songName(),
      duracion: faker.number.int(),
      album: null
    });
    expect(() => service.create("0",newTrack)).rejects.toHaveProperty("message","No se encontro un album con el id proporcionado:")
  });

  it('create should thorw an exception beacause a negative duration', async () => {
    const newTrack: TrackEntity = await repository.save({
      nombre: faker.music.songName(),
      duracion: -1,
      album: album
    });
    expect(() => service.create(album.id,newTrack)).rejects.toHaveProperty("message","La duracion no puede ser negativa")
  });

  it('findOne should return one Track', async () => {
    const storedTrack: TrackEntity = trackList[0];
    const track: TrackEntity = await service.findOne(storedTrack.id);
    expect(track).not.toBeNull();
    expect(track.nombre).toEqual(storedTrack.nombre);
    expect(track.duracion).toEqual(storedTrack.duracion);
  });

  it('findOne should throw an exception for an invalid Track', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "No se enontró un track con el id proporcionado 0")
  });

  it('findAll should return all albums', async () => {
    const tracks: TrackEntity[] = await service.findAll();
    expect(tracks).not.toBeNull();
    expect(tracks).toHaveLength(trackList.length);
  });

});
