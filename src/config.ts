import { extname, join } from 'path';

import { config } from 'dotenv-safe';
import { Level } from 'pino';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

config({
  allowEmptyValues: true,
  path: join(__dirname, '..', '.env'),
  sample: join(__dirname, '..', '.env.example')
});

const migrationsDir = join(__dirname, `migrations/*${extname(__filename)}`);
const dbConfig: PostgresConnectionOptions = {
  type: 'postgres',
  url: process.env.DB_URL!,
  entities: [join(__dirname, `entities/**/*${extname(__filename)}`)],
  extra: {
    application_name: 'workshop'
  },
  migrationsRun: true,
  migrations: [migrationsDir],
  cli: {
    migrationsDir
  },
  synchronize: false
};

export default {
  logLevel: process.env.LOG_LEVEL! as Level,
  env: process.env.ENV_NAME,
  dbConfig,
  applicationName: 'workshop',
  version: process.env.VERSION || 'latest',
  http: {
    port: process.env.HTTP_PORT
  }
};
