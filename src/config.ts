import { join } from 'path';

import { config } from 'dotenv-safe';
import { Level } from 'pino';

config({
  allowEmptyValues: true,
  path: join(__dirname, '..', '.env'),
  sample: join(__dirname, '..', '.env.example'),
});

export default {
  logLevel: process.env.LOG_LEVEL! as Level,
  env: process.env.ENV_NAME,
  applicationName: 'workshop',
  version: process.env.VERSION || 'latest',
  http: {
    port: process.env.HTTP_PORT,
  },
};
