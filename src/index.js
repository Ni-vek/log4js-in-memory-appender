const APPENDER_KEY = Symbol.for('APPENDER_KEY');
const BUFFER_KEY = Symbol.for('BUFFER_KEY');
const FLUSH_KEY = Symbol.for('FLUSH_KEY');
const globalSymbols = Object.getOwnPropertySymbols(global);
const hasAppenderKey = globalSymbols.indexOf(APPENDER_KEY) > -1;
const hasBufferKey = globalSymbols.indexOf(BUFFER_KEY) > -1;
const hasFlushKey = globalSymbols.indexOf(FLUSH_KEY) > -1;

if (!hasAppenderKey) {
  global[APPENDER_KEY] = (config, layouts) => {
    // the default layout for the appender
    let layout = layouts.basicLayout;
    // check if there is another layout specified
    if (config.layout) {
      // load the layout
      layout = layouts.layout(config.layout.type, config.layout);
    }
    // create a new appender instance
    return ((layoutArg, optionsArg) => {
      const options = optionsArg || {};
      const maxBufferSize = options.maxBufferSize || 100;

      const appender = (log) => {
        // This is the appender function itself
        if (!global[BUFFER_KEY][log.categoryName]) {
          global[BUFFER_KEY][log.categoryName] = [];
        }
        if ((global[BUFFER_KEY][log.categoryName].length + 1) > maxBufferSize) {
          const numberToRemove = (global[BUFFER_KEY][log.categoryName].length - maxBufferSize) + 1;
          if (numberToRemove > 0) {
            global[BUFFER_KEY][log.categoryName].splice(0, numberToRemove);
          }
        }
        global[BUFFER_KEY][log.categoryName].push(layoutArg(log, options.timezoneOffset).replace(/\\/g, '\\\\'));
      };

      // add a shutdown function.
      appender.shutdown = (done) => {
        global[BUFFER_KEY] = {};
        done();
      };

      return appender;
    })(layout, config);
  };
}
if (!hasBufferKey) {
  global[BUFFER_KEY] = {};
}
if (!hasFlushKey) {
  global[FLUSH_KEY] = (category) => {
    global[BUFFER_KEY][category] = [];
  };
}

// define the singleton API
// ------------------------
const singleton = {};
Object.defineProperty(singleton, 'configure', {
  get() {
    return global[APPENDER_KEY];
  }
});
Object.defineProperty(singleton, 'buffer', {
  get() {
    return global[BUFFER_KEY];
  }
});
Object.defineProperty(singleton, 'flush', {
  get() {
    return global[FLUSH_KEY];
  }
});

// ensure the API is never changed
// -------------------------------
Object.freeze(singleton);

// export the singleton API only
// -----------------------------
module.exports = singleton;
