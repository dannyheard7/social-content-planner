import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import Platform from './Platform';

@Entity('platform_connection')
@ObjectType()
export class PlatformConnection {
  @PrimaryGeneratedColumn('uuid')
  @Field(type => ID)
  id: string;

  @Column()
  @Field(type => ID)
  userId: string;

  @Column({ type: "enum", enum: Platform })
  platform: Platform;

  @Column()
  accessToken: string;

  @Column({ nullable: true })
  accessTokenSecret?: string;

  @Column()
  entityId: string;

  @Column()
  entityName: string;
}
