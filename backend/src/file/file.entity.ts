import { Field, ID, ObjectType, HideField } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('file')
@ObjectType('File')
export class FileEntity {
  constructor(userId: string, filename: string, extension: string) {
    this.userId = userId;
    this.filename = filename;
    this.ext = extension;
  }

  @PrimaryGeneratedColumn('uuid')
  @Field(type => ID)
  id: string;

  @Column({ nullable: false, name: "user_id" })
  @Field(type => ID)
  userId: string;

  @Column({ length: 50, nullable: false })
  @HideField()
  private filename: string;

  @Column({ length: 10, nullable: false })
  @HideField()
  ext: string;

  @HideField()
  getLargeSizeFilename = () => `${this.filename}-lg${this.ext}`

  @HideField()
  getSmallSizeFilename = () => `${this.filename}-sm${this.ext}`
}
