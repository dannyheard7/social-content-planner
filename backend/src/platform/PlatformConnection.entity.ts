import { Field, ID, ObjectType } from 'type-graphql';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import Platform from './Platform';

@Entity('platformConnection')
@ObjectType('PlatformConnection')
export class PlatformConnection {
  @PrimaryGeneratedColumn('uuid')
  @Field(type => ID)
  id: string;

  @Column({ nullable: false })
  @Field(type => ID)
  userId: string;

  @Column({ type: "enum", enum: Platform })
  @Field(type => Platform)
  platform: Platform;

  @Column()
  accessToken: string;

  @Column()
  @Field(type => ID)
  entityId: string;

  @Column()
  @Field(type => String)
  entityName: string;
}
