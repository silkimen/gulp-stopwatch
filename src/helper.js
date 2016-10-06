'use strict';

const dateformat = require('dateformat');

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

module.exports = { getTimestamp, getTypeOf };
