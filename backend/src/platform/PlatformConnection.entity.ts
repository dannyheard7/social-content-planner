import { Field, ID, ObjectType } from 'type-graphql';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('platformConnection')
@ObjectType('PlatformConnection')
export class PlatformConnection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  @Field(type => ID)
  userId: string;

  @Column()
  @Field(type => String)
  platform: string;

  @Column()
  accessToken: string;

  @Column()
  @Field(type => ID)
  entityId: string;

  @Column()
  @Field(type => String)
  entityName: string;
}
