import { LoggerService as LoggerServiceInterface } from '@nestjs/common';
import Pino, { Logger, destination, Level, LoggerOptions } from 'pino';
import { PrettyOptions } from 'pino-pretty';

import config from '~/config';

const prettyConfig: PrettyOptions = {
  colorize: true,
  levelFirst: true,
  ignore: 'serviceContext',
  translateTime: 'SYS:HH:MM:ss.l',
};

const options: LoggerOptions = {
  level: config.logLevel,
  base: {
    serviceContext: {
      service: config.applicationName,
      version: config.version,
    },
  },
  redact: {
    paths: ['pid', 'hostname', 'body.password'],
    remove: true,
  },
  transport: process.env.PRETTY_LOGGING
    ? {
        target: 'pino-pretty',
        options: prettyConfig,
      }
    : undefined,
};

const stdout = Pino(options);
const stderr = Pino(options, destination(2));

const logger: Pick<Logger, Level> = {
  trace: stdout.trace.bind(stdout),
  debug: stdout.debug.bind(stdout),
  info: stdout.info.bind(stdout),
  warn: stdout.warn.bind(stdout),
  error: stderr.error.bind(stderr),
  fatal: stderr.fatal.bind(stderr),
};

export default logger;

export class LoggerService implements LoggerServiceInterface {
  error(message: unknown, trace?: string, context?: string) {
    logger.error({
      err: {
        message,
        stack: trace,
        context,
      },
    });
  }

  warn(message: string) {
    logger.warn(message);
  }

  log(message: string) {
    logger.info(message);
  }

  debug(message: string) {
    logger.debug(message);
  }

  verbose(message: string) {
    logger.trace(message);
  }
}
