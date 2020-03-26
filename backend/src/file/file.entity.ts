import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('file')
@ObjectType('File')
export class FileEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field(type => ID)
  id: string;

  @Column({ nullable: false })
  @Field(type => ID)
  user_id: string;

  @Column({ length: 50, nullable: false })
  @Field(type => String)
  filename: string;

  @Column({ length: 10, nullable: false })
  @Field(type => String)
  ext: string;
}
