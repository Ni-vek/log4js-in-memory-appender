import {assert} from 'chai';
import memoryAppender from '../src/index';
import * as log4js from 'log4js';

const loggersConfig = {
	appenders: {
		memory: {
			type: 'log4js-in-memory-appender',
		},
	},
	categories: {
		default: {
			appenders: [
				'memory',
			],
			level: 'ALL',
		},
		memory: {
			appenders: [
				'memory',
			],
			level: 'ALL',
		},
	},
};

describe('Memory appender test', () => {

	it('should return a logger instance with category "memory"', () => {
		log4js.configure(loggersConfig);
		const logger = log4js.getLogger('memory');

		assert.strictEqual(logger.category, 'memory', 'Logger category error');
	});

	it('should insert 15 INFO log into "memory" buffer category, and 15 WARN log into "default" buffer category', () => {
		// Resets the logger
		log4js.shutdown(() => {
			// Create loggers
			log4js.configure(loggersConfig);
			const memoryLogger = log4js.getLogger('memory');
			const defaultLogger = log4js.getLogger();

			// Insert logs
			for (let i = 0; i < 15; i++){
				memoryLogger.info(`Test Info #${i}`);
				defaultLogger.warn(`Test Info #${i}`);
			}

			assert.strictEqual(memoryAppender.buffer.memory.length, 15, 'Memory logger category error');
			assert.isOk(/\[INFO]/.test(memoryAppender.buffer.memory[0]), 'Memory logger type error');
			assert.strictEqual(memoryAppender.buffer.default.length, 15, 'Default logger category error');
			assert.isOk(/\[WARN]/.test(memoryAppender.buffer.default[0]), 'Default logger type error');
		})
	});

	it('should only keep 10 logs in memory', () => {
		// Resets the logger
		log4js.shutdown(() => {
			loggersConfig.appenders.memory.maxBufferSize = 10;
			// Create loggers
			log4js.configure(loggersConfig);
			const memoryLogger = log4js.getLogger('memory');

			// Insert logs
			for (let i = 0; i < 15; i++){
				memoryLogger.info(`Test Info #${i}`);
			}

			assert.strictEqual(memoryAppender.buffer.memory.length, 10, 'Memory logger buffer length error');
		})
	});

	it('should remove every logs into "memory" buffer category and leave "default" category as it is', () => {
		// Resets the logger
		log4js.shutdown(() => {
			// Create loggers
			log4js.configure(loggersConfig);
			const memoryLogger = log4js.getLogger('memory');
			const defaultLogger = log4js.getLogger();

			// Insert logs
			memoryLogger.info('Test');
			defaultLogger.info('Test');

			memoryAppender.flush('memory');
			assert.strictEqual(memoryAppender.buffer.memory.length, 0, 'Memory logger flush error');
			assert.strictEqual(memoryAppender.buffer.default.length, 1, 'Default logger flush error');
		})
	});
});
