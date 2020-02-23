import {
  Controller,
  Post,
  Request as Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { diskStorage } from 'multer';
import { basename, extname } from 'path';
import { FileEntity } from './file.entity';
import { FileService } from './file.service';

@Controller('files')
export class FilesController {
  constructor(private readonly fileService: FileService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './files',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    const fileEntity = new FileEntity();
    fileEntity.ext = extname(file.filename);
    fileEntity.filename = basename(file.filename);
    fileEntity.user_id = (req.user as any).sub;
    console.log(fileEntity);
    return await this.fileService.createOrUpdate(fileEntity);
  }
}
