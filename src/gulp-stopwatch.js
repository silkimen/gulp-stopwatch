'use strict';

const helper = require('./helper');
const messageHandlerFactory = require('./message-handler-factory');
const gulpEventHandler = require('./gulp-event-handler');

const setup = (gulpInstance, options) => {
  options = options || {};
  let { events, handler, dateFormat } = options;

  if (helper.getTypeOf(gulpInstance) !== 'object') {
    throw new Error('gulp-stopwatch: got invalid gulp instance');
  }

  if (events === undefined || events === 'log_all') {
    events = [ 'start', 'stop', 'err', 'not_found' ];
  }

  if (helper.getTypeOf(events) !== 'array') {
    throw new Error('gulp-stopwatch: configuration parameter must be an array');
  }

  if (handler === undefined) {
    handler = messageHandlerFactory.write2file('gulp-times.txt');
  }

  if (helper.getTypeOf(handler) !== 'function') {
    throw new Error('gulp-stopwatch: handler must be a function');
  }

  if (dateFormat === undefined) {
    dateFormat = 'yyyy-mm-dd HH:MM:ss';
  }

  if (helper.getTypeOf(dateFormat) !== 'string') {
    throw new Error('gulp-stopwatch: dateFormat must be a  valid dateformat string');
  }

  gulpEventHandler.register(gulpInstance, events, handler, dateFormat);
};

module.exports = { setup, write2file: messageHandlerFactory.write2file };
