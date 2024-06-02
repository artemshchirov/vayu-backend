import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import {
  PrismaModule,
  providePrismaClientExceptionFilter,
  loggingMiddleware,
} from 'nestjs-prisma';
import { GroupsModule } from './groups/groups.module';
import databaseConfig from './config/database.config';
import appConfig from './config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig],
      envFilePath: ['.env'],
    }),
    UsersModule /**
     * PrismaModule is imported globally and configured.
     * @see {@link https://nestjs-prisma.dev/docs/configuration}
     */,
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        middlewares: [loggingMiddleware()],
      },
    }),
    GroupsModule,
  ],
  providers: [
    /**
     * PrismaClientExceptionFilter for handling Prisma DB exceptions.
     * @see {@link https://nestjs-prisma.dev/docs/exception-filter}
     */ providePrismaClientExceptionFilter(),
  ],
})
export class AppModule {}
