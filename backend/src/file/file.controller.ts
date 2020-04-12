import { Controller, Get, Param, Post, Query, Request, Response, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import * as path from 'path';
import * as sharp from 'sharp';
import { FileEntity } from './file.entity';
import { FileService } from './file.service';

@Controller('files')
export class FilesController {
  constructor(
    private readonly configService: ConfigService,
    private readonly fileService: FileService
  ) { }

  @Get(':imgId')
  async test(@Param('imgId') imgId: string, @Query('size') size: "small" | "large" | null, @Response() res) {
    const file = await this.fileService.findById(imgId);

    if (!size || size === "large") {
      return res.sendFile(file.getLargeSizeFilename(), { root: this.configService.get("FILE_DIR") });
    } else {
      return res.sendFile(file.getSmallSizeFilename(), { root: this.configService.get("FILE_DIR") });
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Request() req
  ) {
    const LARGE_PHOTO_WIDTH = 1080;
    const SMALL_PHOTO_WIDTH = 250;

    const fullPath = path.join(this.configService.get("FILE_DIR"), file.filename);

    const parsedPath = path.parse(file.filename);

    const filenameLarge = `${parsedPath.name}-lg${parsedPath.ext}`;
    const filePathLarge = path.join(this.configService.get("FILE_DIR"), filenameLarge);

    const { width } = await sharp(fullPath).metadata();

    if (width > LARGE_PHOTO_WIDTH) {
      await sharp(fullPath).rotate().resize({ width: LARGE_PHOTO_WIDTH }).toFile(filePathLarge);
    } else {
      await sharp(fullPath).rotate().toFile(filePathLarge);
    }

    const filenameSmall = `${parsedPath.name}-sm${parsedPath.ext}`;
    const filePathSmall = path.join(this.configService.get("FILE_DIR"), filenameSmall);

    await sharp(fullPath).rotate().resize({ width: SMALL_PHOTO_WIDTH, height: SMALL_PHOTO_WIDTH }).toFile(filePathSmall);

    await fs.promises.unlink(fullPath)

    const fileEntity = new FileEntity(req.user.sub, parsedPath.name, parsedPath.ext);
    return await this.fileService.createOrUpdate(fileEntity);
  }
}
