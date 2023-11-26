/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString, IsUrl } from "class-validator";

export class PerformerDto {
    
    @IsString()
    @IsNotEmpty()
    readonly nombre: string;

    @IsString()
    @IsNotEmpty()
    readonly descripcion: string;

    @IsUrl()
    @IsString()
    @IsNotEmpty()
    readonly imagen: string;
}
