'use strict';

const dateformat = require('dateformat');
const path = require('path');
const os = require('os');

const getTimestamp = format => `[${dateformat(new Date(), format)}]`;

const getTypeOf = object => {
  switch (Object.prototype.toString.call(object)) {
    case '[object Array]':
      return 'array';
    case '[object Boolean]':
      return 'boolean';
    case '[object Function]':
      return 'function';
    case '[object Null]':
      return 'null';
    case '[object Number]':
      return 'number';
    case '[object Object]':
      return 'object';
    case '[object String]':
      return 'string';
    case '[object Undefined]':
      return 'undefined';
    default:
      return 'unknown';
  }
};

const expandHomeDir = pathIn => {
  if (getTypeOf(pathIn) === 'string' && pathIn.substr(0, 1) === '~') {
    return path.join(os.homedir(), pathIn.substr(1));
  }

  return pathIn;
};

module.exports = { expandHomeDir, getTimestamp, getTypeOf };
