'use strict';

const argv = process.argv.slice(2);

const allowedEvents = [
  'task_start',
  'task_stop',
  'task_err',
  'task_not_found',
  'process_start',
  'process_exit'
];

const register = (gulp, eventNames, handler, dateFormat) => {
  eventNames.forEach(eventName => {
    if (allowedEvents.indexOf(eventName) === -1) {
      throw new Error(`gulp-stopwatch: "${eventName}" is not an available event`);
    }

    if (eventName === 'process_start') {
      return handler({
        argv,
        dateFormat,
        duration: 0,
        task: null,
        type: eventName
      });
    }

    if (eventName === 'process_exit') {
      return process.on('beforeExit', () => handler({
        argv,
        dateFormat,
        duration: process.uptime(),
        task: null,
        type: eventName
      }));
    }

    return gulp.on(eventName, event => {
      event.argv = argv;
      event.dateFormat = dateFormat;
      event.duration = event.duration || 0;
      event.type = eventName;

      handler(event);
    });
  });
};

module.exports = { register, allowedEvents };
