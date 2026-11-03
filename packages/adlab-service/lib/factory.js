/*
 * 24/7 Customer, Inc. Confidential, Do Not Distribute. This is an
 * unpublished, proprietary work which is fully protected under
 * copyright law. This code may only be used pursuant to a valid
 * license from 24/7 Customer, Inc.
 */
'use strict';

import Assert from '@tfs/node-assert';
import { Server } from './server.js';
import * as libUtil from './util.js';

export { make, makeAndRun };

/**
 * Creates an instance of the server
 * @param  {Object} opts Options for creating the server
 * @param  {Object} opts.config The server configuration
 * @param  {Object} opts.logmgr The log manager
 */
async function make(opts) {
  Assert.isObject(opts, 'opts');
  Assert.isObject(opts.config, 'opts.config');
  Assert.isObject(opts.logmgr, 'opts.logmgr');

  const SERVICE_VERSION = libUtil.readVersion();
  const UA_HEADER = libUtil.makeUAHeader(SERVICE_VERSION);

  const serverOpts = { ...opts, version: SERVICE_VERSION, ua: UA_HEADER };

  opts.logmgr.getLogger('SRVR').info('gc.logs.disabled');

  const server = new Server(serverOpts);
  await server._configureMiddlewareAndRoutes();
  return server;
}

/**
 * Creates an instance of the server and runs it
 * @param  {Object} opts Options for creating the server
 * @param  {Object} opts.config The server configuration
 * @param  {Object} opts.logmgr The log manager
 */
async function makeAndRun(opts) {
  const server = await make(opts);
  return new Promise((resolve) => {
    server.once('listening', (listenInfo) => {
      resolve({
        server,
        httpServer: listenInfo.httpServer,
      });
    });
    server.run();
  });
}
