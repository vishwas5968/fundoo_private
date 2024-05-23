import winston, { format } from 'winston';
import 'winston-daily-rotate-file';

/**
 * Logger handles all logs in the application
 */
const logger = winston.createLogger({
  format: format.combine(format.colorize(),format.timestamp(), format.simple()),
  colorize: true,
  transports: [
    new winston.transports.File({
      filename: 'logs/server/error.log',
      level: 'error',
      handleExceptions: true
    }),
    new winston.transports.File({
      filename: 'logs/server/all.log',
      level: 'info',
      handleExceptions: true
    }),
    new winston.transports.DailyRotateFile({
      maxFiles: '14d',
      level: 'info',
      dirname: 'logs/server/daily',
      datePattern: 'YYYY-MM-DD',
      filename: '%DATE%.log'
    }),
    new winston.transports.Console()
  ]
});

/**
 * morganLogger logs all http request in a dedicated file and on console
 */

export default logger;
