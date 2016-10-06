'use strict';

const helper = require('./helper');
const handlerFactory = require('./handler-factory');
const rawEventHandler = require('./raw-event-handler');

const setup = (gulpInstance, options) => {
  options = options || {};
  let { events, handler, dateFormat } = options;

  if (helper.getTypeOf(gulpInstance) !== 'object') {
    throw new Error('gulp-stopwatch: got invalid gulp instance');
  }

  if (events === undefined || events === 'log_all') {
    events = rawEventHandler.allowedEvents;
  }

  if (helper.getTypeOf(events) !== 'array') {
    throw new Error('gulp-stopwatch: configuration parameter must be an array');
  }

  if (handler === undefined) {
    handler = handlerFactory.write2file('gulp-times.txt');
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

  rawEventHandler.register(gulpInstance, events, handler, dateFormat);
};

module.exports = { setup, helper, write2file: handlerFactory.write2file };
