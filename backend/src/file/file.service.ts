import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileEntity } from './file.entity';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
  ) { }
  findById(id: string): Promise<FileEntity | undefined> {
    return this.fileRepository.findOne(id);
  }

  createOrUpdate(file: FileEntity): Promise<FileEntity> {
    return this.fileRepository.save(file);
  }
}
