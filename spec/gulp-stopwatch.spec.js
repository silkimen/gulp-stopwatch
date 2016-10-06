'use strict';

const dateformat = require('dateformat');
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
  beforeEach(() => fakeGulp.reset());

  it('should expose a factory for write-to-file handler', () => {
    expect(stopwatch.write2file('test.txt')).toBeDefined();
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
    it('should register the custom handler for all events', () => {
      const options = {
        handler: message => message
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

      expect(options.handler).toHaveBeenCalledWith(jasmine.any(String));
      expect(options.handler).toHaveBeenCalledWith(jasmine.any(String));
      expect(options.handler).toHaveBeenCalledWith(jasmine.any(String));
      expect(options.handler).toHaveBeenCalledWith(jasmine.any(String));
    });
  });

  describe('when the event names to be logged are given', () => {
    it('should register a handler only for named event "start"', () => {
      const options = {
        events: [ 'start' ]
      };

      spyOn(fakeGulp, 'on').and.callThrough();
      stopwatch.setup(fakeGulp, options);

      expect(fakeGulp.on).toHaveBeenCalledWith('task_start', jasmine.any(Function));
      expect(fakeGulp.on).not.toHaveBeenCalledWith('task_stop', jasmine.any(Function));
      expect(fakeGulp.on).not.toHaveBeenCalledWith('task_err', jasmine.any(Function));
      expect(fakeGulp.on).not.toHaveBeenCalledWith('task_not_found', jasmine.any(Function));
    });

    it('should register a handler only for named event "stop"', () => {
      const options = {
        events: [ 'stop' ]
      };

      spyOn(fakeGulp, 'on').and.callThrough();
      stopwatch.setup(fakeGulp, options);

      expect(fakeGulp.on).not.toHaveBeenCalledWith('task_start', jasmine.any(Function));
      expect(fakeGulp.on).toHaveBeenCalledWith('task_stop', jasmine.any(Function));
      expect(fakeGulp.on).not.toHaveBeenCalledWith('task_err', jasmine.any(Function));
      expect(fakeGulp.on).not.toHaveBeenCalledWith('task_not_found', jasmine.any(Function));
    });

    it('should register a handler only for named event "err"', () => {
      const options = {
        events: [ 'err' ]
      };

      spyOn(fakeGulp, 'on').and.callThrough();
      stopwatch.setup(fakeGulp, options);

      expect(fakeGulp.on).not.toHaveBeenCalledWith('task_start', jasmine.any(Function));
      expect(fakeGulp.on).not.toHaveBeenCalledWith('task_stop', jasmine.any(Function));
      expect(fakeGulp.on).toHaveBeenCalledWith('task_err', jasmine.any(Function));
      expect(fakeGulp.on).not.toHaveBeenCalledWith('task_not_found', jasmine.any(Function));
    });

    it('should register a handler only for named event "not_found"', () => {
      const options = {
        events: [ 'not_found' ]
      };

      spyOn(fakeGulp, 'on').and.callThrough();
      stopwatch.setup(fakeGulp, options);

      expect(fakeGulp.on).not.toHaveBeenCalledWith('task_start', jasmine.any(Function));
      expect(fakeGulp.on).not.toHaveBeenCalledWith('task_stop', jasmine.any(Function));
      expect(fakeGulp.on).not.toHaveBeenCalledWith('task_err', jasmine.any(Function));
      expect(fakeGulp.on).toHaveBeenCalledWith('task_not_found', jasmine.any(Function));
    });
  });

  describe('when a custom date format is given', () => {
    it('should log messages with custom date format', () => {
      const format = 'yyyy-mm-dd';
      const expectedDate = dateformat(new Date(), format);
      let result = null;

      const options = {
        dateFormat: format,
        handler: message => {
          result = message;
        }
      };

      stopwatch.setup(fakeGulp, options);
      handlerList.task_start({ task: 'test_task' });
      expect(result).toMatch(new RegExp(`^\\[${expectedDate}\\] "test_task".*`));
    });
  });
});
