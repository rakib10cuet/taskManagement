import { Module } from '@nestjs/common';
import { KnexModule } from 'nest-knexjs';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RedisModule } from './redis/redis.module';
import { HelperService } from './helper/helper.service';
import { HelperModule } from './helper/helper.module';
import { DropdownsModule } from './engine/dropdowns/dropdowns.module';
import { MastergridsModule } from './engine/mastergrids/mastergrids.module';
import { ImagesModule } from './images/images.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    RedisModule,
    DropdownsModule,
    ImagesModule,
    KnexModule.forRoot({
      config: {
        client: 'mysql',
        version: '5.7',
        useNullAsDefault: true,
        connection: {
          host: '127.0.0.1',
          user: 'root',
          password: '',
          database: 'tast_managements',
        },
      },
    }),
    HelperModule,
    KnexModule,
    DropdownsModule,
    MastergridsModule,
  ],
  controllers: [AppController],
  providers: [AppService, HelperService],
})
export class AppModule {}
