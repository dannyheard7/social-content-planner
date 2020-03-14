import {
  Controller,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Get,
  Param,
  Response,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { basename, extname } from 'path';
import { FileEntity } from './file.entity';
import { FileService } from './file.service';
import { CurrentUser } from '../authz/current.user.decorator';

@Controller('files')
export class FilesController {
  constructor(private readonly fileService: FileService) { }

  @Get(':imgId')
  async test(@Param('imgId') imgId, @Response() res) {
    const file = await this.fileService.findById(imgId);

    return res.sendFile(file.filename, { root: 'files' });
  }

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
    @Request() req
  ) {
    const fileEntity = new FileEntity();
    fileEntity.ext = extname(file.filename);
    fileEntity.filename = basename(file.filename);
    fileEntity.user_id = req.user.sub;
    return await this.fileService.createOrUpdate(fileEntity);
  }
}
