import { Field, ID, ObjectType, HideField } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('file')
@ObjectType('File')
export class FileEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field(type => ID)
  id: string;

  @Column({ nullable: false, name: "user_id" })
  @Field(type => ID)
  userId: string;

  @Column({ length: 50, nullable: false })
  @HideField()
  filename: string;

  @Column({ length: 10, nullable: false })
  @Field(type => String)
  ext: string;
}
