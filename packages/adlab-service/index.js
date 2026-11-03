#!/usr/bin/env node
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
import libPath, { dirname } from 'path';
// import { init as initGCListener } from '@tfs/node-gc-logger';
import libUncaught from '@tfs/node-uncaught';
import os from 'os';
import cluster from 'cluster';
import { fileURLToPath } from 'url';
import { makeAndRun } from './lib/factory.js';
import { PrimaryServer } from './lib/primaryserver.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const USAGE = `USAGE: ${process.argv.slice(0, 2).join(' ')} --config <path-to-config> [--config <config2> ...]`;

const LOG_CONFIG_KEY = 'service-log.config-path';
// const GC_LOG_ENABLED_CONFIG_KEY = 'gc-log.enabled';
const WORKER_COUNT_CONFIG_KEY = 'workers.count';
const WORKER_EXEC_ARGV_CONFIG_KEY = 'workers.execArgv';

const USE_STRICT = '--use-strict';

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
if (logConfigPath) {
  logConfigPath = libPath.resolve(__dirname, logConfigPath);
  log4js.configure(logConfigPath);
} else {
  /* eslint-disable no-console */
  console.warn(`${LOG_CONFIG_KEY} not specified in config. log4js not configured`);
  /* eslint-enable no-console */
}

const LOGGER = log4js.getLogger('SRVR');

// fail fast; fix the bug(s)
libUncaught.initialize(LOGGER);

process.on('warning', (warning) => {
  LOGGER.warn(warning.name, { error: warning.message, stack: warning.stack });
});

/* if (config.getBool(GC_LOG_ENABLED_CONFIG_KEY)) {
  initGCListener({ logmgr: log4js });
} else { */
LOGGER.info('gc.logs.disabled');
/* } */

const serverOpts = {
  logmgr: log4js,
  config,
};

let totalWorkers = config.get(WORKER_COUNT_CONFIG_KEY, 0);
if (totalWorkers === -1) {
  totalWorkers = os.cpus().length;
}

if (totalWorkers === 0) {
  LOGGER.info('init.nocluster');
  makeAndRun(serverOpts).then(({ server }) => {
    server.once('close', () => {
      log4js.shutdown();
    });

    process.on('SIGTERM', () => {
      server.close();
    });

    process.on('SIGINT', () => {
      server.close('SIGINT');
    });
  });
} else if (cluster.isMaster) {
  const execArgv = config.get(WORKER_EXEC_ARGV_CONFIG_KEY, []);
  Assert.isArray(execArgv, WORKER_EXEC_ARGV_CONFIG_KEY);
  if (execArgv.indexOf(USE_STRICT) === -1) {
    execArgv.push(USE_STRICT);
  }

  log4js.getLogger('MSRVR').info('init.cluster', { workers: totalWorkers, execArgv });
  cluster.setupMaster({
    exec: `${__dirname}/worker.js`,
    execArgv,
    silent: false,
  });

  const primary = new PrimaryServer({ totalWorkers, ...serverOpts });

  primary.once('close', () => {
    log4js.shutdown();
  });

  primary.run();
}

/* eslint-disable no-console */
function bail(msg) {
  if (msg) {
    console.error(msg);
  }

  console.error(USAGE);
  process.exit(1);
}
/* eslint-enable no-console */
