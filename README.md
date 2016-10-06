# gulp-stopwatch [![Build Status](https://travis-ci.org/silkimen/gulp-stopwatch.svg?branch=master)](https://travis-ci.org/silkimen/gulp-stopwatch) [![Dependency Status](https://david-dm.org/silkimen/gulp-stopwatch.svg)](https://david-dm.org/silkimen/gulp-stopwatch)


Use this module to record runtime duration of your gulp tasks. Persist the data on the hard disk or use a custom handler to e.g. send them to a server.

This way you can log and analyze performance issues in your team's gulp build and dev cycle. You can see which tasks are taking too long on different machines and which tasks are used more often.

Just load this module in your gulpfile.js and run the `setup()` function to activate the hooks with default configuration.

## Installation
```bash
npm install gulp-stopwatch
```

## Usage examples

Default handler and default date format, log all events:
```js
require('gulp-stopwatch').setup(gulp);
```

Default handler and default date format, log all events, but change output file name:
```js
const stopwatch = require('gulp-stopwatch');

stopwatch.setup(gulp, {
  handler: stopwatch.write2file('record.txt')
});
```

Default handler and default date format, but do only log events `start` and `stop`:
```js
const stopwatch = require('gulp-stopwatch');

stopwatch.setup(gulp, {
  events: [ 'start', 'stop' ]
});
```

Default date format, do only log event `stop` and use a custom handler:
```js
const stopwatch = require('gulp-stopwatch');

stopwatch.setup(gulp, {
  events: [ 'stop' ],
  handler: message => console.log(message)
});
```

Default handler, do only log event `stop` and use a custom date format:
```js
const stopwatch = require('gulp-stopwatch');

stopwatch.setup(gulp, {
  events: [ 'stop' ],
  dateFormat: 'yyyy-mm-dd'
});
```

## Options

#### options.handler
Type: `Function`

Define a custom handler which is called for every registered event (see usage examples).

#### options.dateFormat
Type: `String`

Define a custom date format which is used in the log messages.

#### options.events
Type: `Array` || `String
`
An array defining which events should be logged or 'log_all'. Defaults to logging all events.

> Available events are:
* start
* stop
* err
* not_found
