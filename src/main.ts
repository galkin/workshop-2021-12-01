import { NestFactory } from '@nestjs/core';
import { AppModule } from '~/app.module';
import config from '~/config';
import { LoggerService } from '~/logger';
import { RestLoggingInterceptor } from '~/blocks/interceptors/rest-logging';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new LoggerService()
  });
  app.useGlobalInterceptors(new RestLoggingInterceptor());
  await app.listen(config.http.port);
}
bootstrap();
