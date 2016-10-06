'use strict';

const helper = require('./helper');
const gulpEvents = [ 'start', 'stop', 'err', 'not_found' ];

const register = (gulp, eventNames, messageHandler, dateFormat) => {
  const getPrefix = () => `${helper.getTimestamp(dateFormat)} `;

  const eventHandlers = {
    start: event =>
      messageHandler(`${getPrefix()}"${event.task}" started`),

    stop: event =>
      messageHandler(`${getPrefix()}"${event.task}" finished, duration ${event.duration}s`),

    err: event =>
      messageHandler(`${getPrefix()}"${event.task}" failed, duration: ${event.duration}s`),

    // eslint-disable-next-line camelcase
    not_found: event =>
      messageHandler(`${getPrefix()}"${event.task}" not found`)
  };

  eventNames.forEach(eventName => {
    if (gulpEvents.indexOf(eventName) === -1) {
      throw new Error(`gulp-stopwatch: "${eventName}" is not an available event`);
    }

    gulp.on(`task_${eventName}`, eventHandlers[eventName]);
  });
};

module.exports = { register };
