/* eslint-disable prettier/prettier */
import { Controller, Param, Post, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { AlbumPerformerService } from './album-performer.service';

@Controller('albums')
@UseInterceptors(BusinessErrorsInterceptor)
export class AlbumPerformerController {

    constructor(
        private readonly albumService: AlbumPerformerService,
    ) { }

    @Post(':albumId/performers/:performerId')
    async addPerformer(@Param('albumId') albumId: string, @Param('performerId') performerId: string) {
        return await this.albumService.addPerformerToAlbum(albumId, performerId);
    }
}
