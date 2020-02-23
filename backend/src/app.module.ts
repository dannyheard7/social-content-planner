import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { AuthzModule } from './authz/authz.module';
import { SocialProviderModule } from './social-provider/social-provider.module';
import { PostModule } from './post/post.module';
import { FileModule } from './file/file.module';
import { PublisherModule } from './publisher/publisher.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres' as 'postgres',
        host: configService.get<string>('TYPEORM_HOST'),
        port: parseInt(configService.get<string>('TYPEORM_PORT')),
        username: configService.get<string>('TYPEORM_USERNAME'),
        password: configService.get<string>('TYPEORM_PASSWORD'),
        database: configService.get<string>('TYPEORM_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,
        logging: true,
      }),
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
      uploads: true,
      context: ({ req }) => ({ req }),
    }),
    AuthzModule,
    SocialProviderModule,
    PostModule,
    FileModule,
    PublisherModule,
  ],
  providers: [],
})
export class AppModule {}
