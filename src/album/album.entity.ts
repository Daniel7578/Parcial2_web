/* eslint-disable prettier/prettier */
import { PerformerEntity } from "../performer/performer.entity";
import { TrackEntity } from "../track/track.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class AlbumEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @Column()
    fechaLanzamiento: Date;

    @Column()
    descripcion: string;

    @Column()
    caratula: string;

    @OneToMany(()=>TrackEntity,tracks => tracks.album)
    tracks: TrackEntity[];

    @ManyToMany(()=>PerformerEntity,performers => performers.albums)
    @JoinTable()
    performers: PerformerEntity[];
}
