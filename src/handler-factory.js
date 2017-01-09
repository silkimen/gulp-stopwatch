'use strict';

const fs = require('fs');
const helper = require('./helper');
const mkdirp = require('mkdirp');
const path = require('path');

const getMessage = ({ argv, dateFormat, duration, task, type }) => {
  switch (type) {
    case 'task_start':
      return `${helper.getTimestamp(dateFormat)} "${task}" started`;
    case 'task_stop':
      return `${helper.getTimestamp(dateFormat)} "${task}" finished, duration ${duration}s`;
    case 'task_err':
      return `${helper.getTimestamp(dateFormat)} "${task}" failed, duration: ${duration}s`;
    case 'task_not_found':
      return `${helper.getTimestamp(dateFormat)} "${task}" not found`;
    case 'process_start':
      return `${helper.getTimestamp(dateFormat)} node process started with arguments "${argv.join(' ')}"`;
    case 'process_exit':
      return `${helper.getTimestamp(dateFormat)} node process finished, duration ${duration}s`;
    default:
      return `${helper.getTimestamp(dateFormat)} an unknown event occured`;
  }
};

const write2file = filename => event => {
  const resolvedPath = helper.expandHomeDir(filename);

  mkdirp.sync(path.dirname(resolvedPath));
  fs.appendFileSync(resolvedPath, `${getMessage(event)}\n`);
};

const write2csv = filename => event => {
  const { argv, dateFormat, duration, task, type } = event;
  const resolvedPath = helper.expandHomeDir(filename);
  const csvLine = `"${helper.getTimestamp(dateFormat)}","${type}","${task}","${argv.join(' ')}","${duration}"\n`;

  mkdirp.sync(path.dirname(resolvedPath));
  fs.appendFileSync(resolvedPath, csvLine);
};

/** @todo: add a handler that logs messages to server via http call */

module.exports = { write2file, write2csv };
