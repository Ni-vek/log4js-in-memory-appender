const log4js = require('log4js');
const inMemoryAppender = require('./../src');

log4js.configure({
  appenders: {
    memory: {
      type: 'log4js-in-memory-appender',
      maxBufferSize: 100 // [Optional] Buffer size per category - default 100
    },
  },
  categories: {
    default: {
      appenders: [
        'memory',
      ],
      level: 'ALL',
    },
  },
});

const logger = log4js.getLogger();

logger.trace('trace');
logger.debug('debug');
logger.info('info');
logger.warn('warn');
logger.error('error');
logger.fatal('fatal');
logger.mark('mark');

console.log(inMemoryAppender.buffer);
