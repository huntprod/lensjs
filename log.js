;(function () {

  var nil = function () { };

  if (!console) {
    console = { log: nil };
  }

  var log = {
    debug: nil,
    info:  nil,
    warn:  nil,
    error: nil,

    level: function (level) {
      log.debug = nil;
      log.info  = nil;
      log.warn  = nil;
      log.error = nil;

      switch (level) {
      case 'debug': log.debug = console.log;
      case 'info':  log.info  = console.log;
      case 'warn':  log.warn  = console.log;
      case 'info':  log.info  = console.log;
      }
    }
  };

  Lens.log = log;
})()
