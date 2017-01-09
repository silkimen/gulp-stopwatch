# gulp-stopwatch [![Build Status](https://travis-ci.org/silkimen/gulp-stopwatch.svg?branch=master)](https://travis-ci.org/silkimen/gulp-stopwatch) [![Dependency Status](https://david-dm.org/silkimen/gulp-stopwatch.svg)](https://david-dm.org/silkimen/gulp-stopwatch)


Use this module to record runtime duration of your gulp tasks. Persist the data on the hard disk or use a custom handler to e.g. send them to a server.

This way you can log and analyze performance issues in your team's gulp build and dev cycle. You can see which tasks are taking too long on different machines and which tasks are used more often.

Just load this module in your `gulpfile.js` and run the `setup()` function to activate the hooks with default configuration.

## Installation
```bash
npm install gulp-stopwatch
```

## Usage examples

Place one of the following code examples in your `gulpfile.js`.

#### Default handler and default date format, log all events:
```js
require('gulp-stopwatch').setup(gulp);
```

#### Default handler and default date format, log all events, but change output file name:
```js
const stopwatch = require('gulp-stopwatch');

stopwatch.setup(gulp, {
  handler: stopwatch.write2file('record.txt')
});
```

#### CSV handler (write comma-separated values) and default date format, log all events:
```js
const stopwatch = require('gulp-stopwatch');

stopwatch.setup(gulp, {
  handler: stopwatch.write2csv('record.txt')
});
```

#### Default handler and default date format, but do only log events `task_start` and `task_stop`:
```js
const stopwatch = require('gulp-stopwatch');

stopwatch.setup(gulp, {
  events: [ 'task_start', 'task_stop' ]
});
```

#### Default date format, do only log event `task_stop` and use a custom handler:
```js
const stopwatch = require('gulp-stopwatch');

stopwatch.setup(gulp, {
  events: [ 'task_stop' ],
  handler: event => console.log(event)
});

/*  example gulp call:
 *    gulp build:application --test=test
 *
 *  example log output:
 *    {
 *      task: 'build:application',
 *      message: 'build:application stream',
 *      duration: 0.070326957,
 *      hrDuration: [ 0, 70326957 ],
 *      argv: [ 'build:application', '--test=test' ],
 *      dateFormat: 'yyyy-mm-dd HH:MM:ss',
 *      type: 'task_stop'
 *    }
 */
```

#### Default handler, do only log event `task_stop` and use a custom date format:
```js
const stopwatch = require('gulp-stopwatch');

stopwatch.setup(gulp, {
  events: [ 'task_stop' ],
  dateFormat: 'yyyy-mm-dd'
});
```

## Options

#### options.handler
Type: `Function`

Define a custom handler (or one of the shipped handlers) which is called for every registered event with the attributes `argv`, `dateFormat`, `duration`, `task`, `type` and additional attributes passed in by gulp (see usage examples).

#### options.dateFormat
Type: `String`

Define a custom date format which is used in the log messages.

#### options.events
Type: `Array` || `String`

An array defining which events should be logged or string `log_all`. Defaults to logging all events.

> Available events are:
* task_start
* task_stop
* task_err
* task_not_found
* process_start
* process_exit
