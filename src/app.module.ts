import { Module } from '@nestjs/common';
import { AppController } from '~/controllers/app.controller';
import { AppService } from '~/services/app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from '~/config';
import { queryLogger } from '~/logger';
import { AuthenticationController } from '~/controllers/auth.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...config.dbConfig,
      logger: queryLogger
    })
  ],
  controllers: [AppController, AuthenticationController],
  providers: [AppService]
})
export class AppModule {}
