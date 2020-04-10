import { Controller, Get, Param, Post, Request, Response, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { basename, extname } from 'path';
import { FileEntity } from './file.entity';
import { FileService } from './file.service';

@Controller('files')
export class FilesController {
  constructor(
    private readonly configService: ConfigService,
    private readonly fileService: FileService
  ) { }

  @Get(':imgId')
  async test(@Param('imgId') imgId, @Response() res) {
    const file = await this.fileService.findById(imgId);

    return res.sendFile(file.filename, { root: this.configService.get("FILE_DIR") });
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Request() req
  ) {
    const fileEntity = new FileEntity();
    fileEntity.ext = extname(file.filename);
    fileEntity.filename = basename(file.filename);
    fileEntity.userId = req.user.sub;
    return await this.fileService.createOrUpdate(fileEntity);
  }
}
