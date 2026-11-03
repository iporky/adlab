/*
 * 24/7 Customer, Inc. Confidential, Do Not Distribute. This is an
 * unpublished, proprietary work which is fully protected under
 * copyright law. This code may only be used pursuant to a valid
 * license from 24/7 Customer, Inc.
 */
'use strict';

import Assert from '@tfs/node-assert';
import nopt from 'nopt';
import log4js from 'log4js';
import libConfig from '@tfs/node-config';
import libPath from 'path';
import libUncaught from '@tfs/node-uncaught';
import { makeAndRun } from './lib/factory.js';

const LOG_CONFIG_KEY = 'service-log.config-path-worker';

const knownOpts = { config: Array };
const shortHands = {};
const opts = nopt(knownOpts, shortHands, process.argv, 2);

if (!opts.config || !opts.config.length) {
  bail('one or more config options are required');
}

const config = libConfig.loadFile(opts.config[0]);
opts.config.shift();
opts.config.forEach((path) => {
  config.addOverlay(libConfig.loadFile(path));
});

let logConfigPath = config.get(LOG_CONFIG_KEY);
Assert.notEmpty(logConfigPath, LOG_CONFIG_KEY);
logConfigPath = libPath.resolve(__dirname, logConfigPath);
log4js.configure(logConfigPath, {});

const LOGGER = log4js.getLogger('WRKR');

libUncaught.initialize(LOGGER);

process.on('warning', (warning) => {
  LOGGER.warn(warning.name, { error: warning.message, stack: warning.stack });
});

const serverOpts = {
  logmgr: log4js,
  config,
};

makeAndRun(serverOpts).then(({ server }) => {
  process.on('message', (event) => {
    handleEvent(event, server);
  });

  server.once('close', () => {
    process.exit(0);
  });
});

function handleEvent(event, server) {
  LOGGER.debug(`handleEvent: ${event.name}`);
  switch (event.name) {
  case 'shutdown':
    server.close(event.name);
    break;
  default:
    LOGGER.warn(`unexpected event: ${event.name}`);
  }
}

/* eslint-disable no-console */
function bail(msg) {
  if (msg) {
    console.error(msg);
  }

  process.exit(1);
}
/* eslint-enable no-console */
