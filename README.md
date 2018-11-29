# log4js-in-memory-appender
[![Build Status](https://travis-ci.org/flexdinesh/npm-module-boilerplate.svg?branch=master)](https://travis-ci.org/flexdinesh/npm-module-boilerplate) [![dependencies Status](https://david-dm.org/flexdinesh/npm-module-boilerplate/status.svg)](https://david-dm.org/flexdinesh/npm-module-boilerplate) [![devDependencies Status](https://david-dm.org/flexdinesh/npm-module-boilerplate/dev-status.svg)](https://david-dm.org/flexdinesh/npm-module-boilerplate?type=dev) [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

log4js v2 in memory appender, filtered by category, as a singleton API

## Install

```
npm i log4js-in-memory-appender
```


## Usage

```js
const log4js = require('log4js');
const inMemoryAppender = require('log4js-in-memory-appender');

log4js.configure({
    appenders: {
        memory: {
            type: 'log4js-in-memory-appender',
            maxBufferSize: 100 // Optional default 100
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
```

## Example Output

``` js
{ 
  default:
   [ 
     '[2018-11-29T16:01:09.232] [TRACE] default - trace',
     '[2018-11-29T16:01:09.235] [DEBUG] default - debug',
     '[2018-11-29T16:01:09.235] [INFO] default - info',
     '[2018-11-29T16:01:09.235] [WARN] default - warn',
     '[2018-11-29T16:01:09.236] [ERROR] default - error',
     '[2018-11-29T16:01:09.236] [FATAL] default - fatal',
     '[2018-11-29T16:01:09.236] [MARK] default - mark' 
   ] 
}
```
## Flushing buffer

``` js
inMemoryAppender.flush();
```
## Example
Run example from the root folder

``` js
node examples/example.js
```
## License

MIT © Kevin Balini
