'use strict';

const fs = require('fs');

const write2file = filename => message => fs.appendFileSync(filename, `${message}\n`);

/** @todo: add a handler that logs messages to server via http call */

module.exports = { write2file };
