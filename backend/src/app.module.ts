import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthzModule } from './authz/authz.module';
import { CommonModule } from './common/common.module';
import { FileModule } from './file/file.module';
import { PlatformModule } from './platform/platform.module';
import { PostModule } from './post/post.module';

@Module({
  imports: [
    ConfigModule.forRoot({
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
        logging: process.env.NODE_ENV === "development",
      }),
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
      uploads: true,
      context: ({ req }) => ({ req }),
    }),
    MailerModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('SMTP_SERVER'),
          port: configService.get<string>('SMTP_PORT'),
          ignoreTLS: true,
          secure: true,
          auth: {
            user: configService.get<string>('EMAIL_SENDER'),
            pass: configService.get<string>('EMAIL_SENDER_PASSWORD'),
          },
        },
        defaults: {
          from: `"${configService.get<string>('EMAIL_SENDER_NAME')}" <${configService.get<string>('EMAIL_SENDER')}>`,
        },
      }),
      imports: [ConfigModule],
      inject: [ConfigService]
    }),
    AuthzModule,
    PlatformModule,
    PostModule,
    FileModule,
    CommonModule
  ],
  providers: [],
})
export class AppModule { }
