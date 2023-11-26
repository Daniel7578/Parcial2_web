/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString, IsUrl } from "class-validator";

export class AlbumDto{

    @IsString()
    @IsNotEmpty()
    readonly nombre: string;

    @IsString()
    @IsNotEmpty()
    readonly fechaLanzamiento: string;

    @IsString()
    @IsNotEmpty()
    readonly descripcion: string;

    @IsUrl()
    @IsString()
    @IsNotEmpty()
    readonly caratula: string;
}
