import { Field, ID, ObjectType } from 'type-graphql';
import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('file')
@ObjectType('File')
export class FileEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field(type => ID)
  id: string;

  @Field(type => ID)
  user_id: string;

  @Field(type => String)
  filename: string;

  @Field(type => String)
  ext: string;
}
