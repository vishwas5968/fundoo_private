const { format, transports, level } = require('winston');
const winston = require('winston');
const { combine, timestamp, printf } = format;

export const logger = winston.createLogger({
  level: 'silly',
  format: combine(
    timestamp(),
    printf((info) => {
      `[${info.timestamp}] ${info.level}: ${info.message} Hello`;
    })
  ),
  transports: [new transports.Console()]
});
