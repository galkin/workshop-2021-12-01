import { NestFactory } from '@nestjs/core';
import { AppModule } from '~/app.module';
import config from '~/config';
import { LoggerService } from '~/logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new LoggerService(),
  });
  await app.listen(config.http.port);
}
bootstrap();
