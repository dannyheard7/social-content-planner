import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import Platform from './Platform';

@Entity('platformConnection')
@ObjectType()
export class PlatformConnection {
  @PrimaryGeneratedColumn('uuid')
  @Field(type => ID)
  id: string;

  @Column({ nullable: false })
  @Field(type => ID)
  userId: string;

  @Column({ type: "enum", enum: Platform })
  platform: Platform;

  @Column()
  accessToken: string;

  @Column()
  @Field(type => ID)
  entityId: string;

  @Column()
  entityName: string;
}
