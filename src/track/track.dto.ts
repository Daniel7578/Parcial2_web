/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { AlbumDto } from "../album/album.dto";

export class TrackDto {
    
    @IsString()
    @IsNotEmpty()
    readonly nombre: string;

    @IsNumber()
    @IsNotEmpty()
    readonly duracion: number;

    @IsNotEmpty()
    readonly album: AlbumDto;
}
