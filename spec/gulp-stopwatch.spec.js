'use strict';

const fs = require('fs');
const stopwatch = require('../dist/gulp-stopwatch');

let handlerList = {};

const fakeGulp = {
  on: (eventName, eventHandler) => {
    handlerList[eventName] = eventHandler;
  },
  reset: () => {
    handlerList = {};
  }
};

describe('Gulp Stopwatch', () => {
  beforeEach(() => {
    fakeGulp.reset();
    spyOn(fs, 'appendFileSync');
    spyOn(process, 'on');
  });

  it('should expose a factory for write-to-file handler', () => {
    expect(stopwatch.write2file('test.txt')).toBeDefined();
  });

  it('should expose a factory for write-to-csv handler', () => {
    expect(stopwatch.write2csv('test.txt')).toBeDefined();
  });

  describe('when no options are given', () => {
    it('should register a handler for all events', () => {
      spyOn(fakeGulp, 'on');
      stopwatch.setup(fakeGulp);

      expect(fakeGulp.on).toHaveBeenCalledWith('task_start', jasmine.any(Function));
      expect(fakeGulp.on).toHaveBeenCalledWith('task_stop', jasmine.any(Function));
      expect(fakeGulp.on).toHaveBeenCalledWith('task_err', jasmine.any(Function));
      expect(fakeGulp.on).toHaveBeenCalledWith('task_not_found', jasmine.any(Function));
    });
  });

  describe('when a custom handler is given', () => {
    it('should register the custom handler for all gulp events', () => {
      const options = {
        handler: event => event
      };

      spyOn(fakeGulp, 'on').and.callThrough();
      spyOn(options, 'handler').and.callThrough();
      stopwatch.setup(fakeGulp, options);

      expect(fakeGulp.on).toHaveBeenCalledWith('task_start', jasmine.any(Function));
      expect(fakeGulp.on).toHaveBeenCalledWith('task_stop', jasmine.any(Function));
      expect(fakeGulp.on).toHaveBeenCalledWith('task_err', jasmine.any(Function));
      expect(fakeGulp.on).toHaveBeenCalledWith('task_not_found', jasmine.any(Function));

      handlerList.task_start({ task: 'start' });
      handlerList.task_stop({ task: 'stop' });
      handlerList.task_err({ task: 'err' });
      handlerList.task_not_found({ task: 'not_found' });

      expect(options.handler).toHaveBeenCalledWith(jasmine.any(Object));
      expect(options.handler).toHaveBeenCalledWith(jasmine.any(Object));
      expect(options.handler).toHaveBeenCalledWith(jasmine.any(Object));
      expect(options.handler).toHaveBeenCalledWith(jasmine.any(Object));
    });

    it('should call the custom handler with correct type of attributes', () => {
      const options = {
        handler: event => event
      };

      const correctAttributes = {
        argv: jasmine.any(Array),
        dateFormat: jasmine.any(String),
        duration: jasmine.any(Number),
        task: jasmine.any(String),
        type: jasmine.any(String)
      };

      spyOn(fakeGulp, 'on').and.callThrough();
      spyOn(options, 'handler').and.callThrough();
      stopwatch.setup(fakeGulp, options);

      expect(fakeGulp.on).toHaveBeenCalledWith('task_start', jasmine.any(Function));
      expect(fakeGulp.on).toHaveBeenCalledWith('task_stop', jasmine.any(Function));
      expect(fakeGulp.on).toHaveBeenCalledWith('task_err', jasmine.any(Function));
      expect(fakeGulp.on).toHaveBeenCalledWith('task_not_found', jasmine.any(Function));
      expect(process.on).toHaveBeenCalledWith('beforeExit', jasmine.any(Function));

      handlerList.task_start({ task: 'start' });
      handlerList.task_stop({ task: 'stop' });
      handlerList.task_err({ task: 'err' });
      handlerList.task_not_found({ task: 'not_found' });

      expect(options.handler).toHaveBeenCalledWith(correctAttributes);
      expect(options.handler).toHaveBeenCalledWith(correctAttributes);
      expect(options.handler).toHaveBeenCalledWith(correctAttributes);
      expect(options.handler).toHaveBeenCalledWith(correctAttributes);
    });
  });

  describe('when the event names to be logged are given', () => {
    it('should register a handler only for named event "task_start"', () => {
      const options = {
        events: [ 'task_start' ]
      };

      spyOn(fakeGulp, 'on').and.callThrough();
      stopwatch.setup(fakeGulp, options);

      expect(fakeGulp.on).toHaveBeenCalledWith('task_start', jasmine.any(Function));
      expect(fakeGulp.on).not.toHaveBeenCalledWith('task_stop', jasmine.any(Function));
      expect(fakeGulp.on).not.toHaveBeenCalledWith('task_err', jasmine.any(Function));
      expect(fakeGulp.on).not.toHaveBeenCalledWith('task_not_found', jasmine.any(Function));
      expect(process.on).not.toHaveBeenCalledWith('beforeExit', jasmine.any(Function));
    });

    it('should register a handler only for named event "task_stop"', () => {
      const options = {
        events: [ 'task_stop' ]
      };

      spyOn(fakeGulp, 'on').and.callThrough();
      stopwatch.setup(fakeGulp, options);

      expect(fakeGulp.on).not.toHaveBeenCalledWith('task_start', jasmine.any(Function));
      expect(fakeGulp.on).toHaveBeenCalledWith('task_stop', jasmine.any(Function));
      expect(fakeGulp.on).not.toHaveBeenCalledWith('task_err', jasmine.any(Function));
      expect(fakeGulp.on).not.toHaveBeenCalledWith('task_not_found', jasmine.any(Function));
      expect(process.on).not.toHaveBeenCalledWith('beforeExit', jasmine.any(Function));
    });

    it('should register a handler only for named event "task_err"', () => {
      const options = {
        events: [ 'task_err' ]
      };

      spyOn(fakeGulp, 'on').and.callThrough();
      stopwatch.setup(fakeGulp, options);

      expect(fakeGulp.on).not.toHaveBeenCalledWith('task_start', jasmine.any(Function));
      expect(fakeGulp.on).not.toHaveBeenCalledWith('task_stop', jasmine.any(Function));
      expect(fakeGulp.on).toHaveBeenCalledWith('task_err', jasmine.any(Function));
      expect(fakeGulp.on).not.toHaveBeenCalledWith('task_not_found', jasmine.any(Function));
      expect(process.on).not.toHaveBeenCalledWith('beforeExit', jasmine.any(Function));
    });

    it('should register a handler only for named event "task_not_found"', () => {
      const options = {
        events: [ 'task_not_found' ]
      };

      spyOn(fakeGulp, 'on').and.callThrough();
      stopwatch.setup(fakeGulp, options);

      expect(fakeGulp.on).not.toHaveBeenCalledWith('task_start', jasmine.any(Function));
      expect(fakeGulp.on).not.toHaveBeenCalledWith('task_stop', jasmine.any(Function));
      expect(fakeGulp.on).not.toHaveBeenCalledWith('task_err', jasmine.any(Function));
      expect(fakeGulp.on).toHaveBeenCalledWith('task_not_found', jasmine.any(Function));
      expect(process.on).not.toHaveBeenCalledWith('beforeExit', jasmine.any(Function));
    });

    it('should register a handler only for named event "process_exit"', () => {
      const options = {
        events: [ 'process_exit' ]
      };

      spyOn(fakeGulp, 'on').and.callThrough();
      stopwatch.setup(fakeGulp, options);

      expect(fakeGulp.on).not.toHaveBeenCalledWith('task_start', jasmine.any(Function));
      expect(fakeGulp.on).not.toHaveBeenCalledWith('task_stop', jasmine.any(Function));
      expect(fakeGulp.on).not.toHaveBeenCalledWith('task_err', jasmine.any(Function));
      expect(fakeGulp.on).not.toHaveBeenCalledWith('task_not_found', jasmine.any(Function));
      expect(process.on).toHaveBeenCalledWith('beforeExit', jasmine.any(Function));
    });
  });

  describe('when a custom date format is given', () => {
    it('should log messages with custom date format', () => {
      const expectedformat = 'yyyy-mm-dd';
      let actualFormat = null;

      const options = {
        dateFormat: expectedformat,
        handler: event => {
          actualFormat = event.dateFormat;
        }
      };

      stopwatch.setup(fakeGulp, options);
      handlerList.task_start({ task: 'test_task' });
      expect(actualFormat).toEqual(expectedformat);
    });
  });
});
