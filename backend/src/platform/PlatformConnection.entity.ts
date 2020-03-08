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
  network: string;

  @Column()
  accessToken: string;

  @Column()
  @Field(type => ID)
  entityId: string;
}
