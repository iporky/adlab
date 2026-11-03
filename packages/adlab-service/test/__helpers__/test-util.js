/*
 * 24/7 Customer, Inc. Confidential, Do Not Distribute. This is an
 * unpublished, proprietary work which is fully protected under
 * copyright law. This code may only be used pursuant to a valid
 * license from 24/7 Customer, Inc.
 */
'use strict';

import log4js from 'log4js';
import libPath, { dirname } from 'path';
import libConfig from '@tfs/node-config';
import { fileURLToPath } from 'url';
import { Server } from '../../lib/server';
import * as libUtil from '../../lib/util';
import RAW_CONFIG_SOURCE from '../../config/service-template.json';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const HEARTBEAT_PATH = libPath.join(`${__dirname}/../`, '/heartbeat.txt');

const SERVICE_LOG_PATH = libPath.join(__dirname, '../../config/service-template-logging.json');

log4js.configure(SERVICE_LOG_PATH);

let RAW_CONFIG = JSON.parse(JSON.stringify(RAW_CONFIG_SOURCE));

export const getRawConfig = function () {
  return RAW_CONFIG;
};

export const restoreConfig = function () {
  RAW_CONFIG = JSON.parse(JSON.stringify(RAW_CONFIG_SOURCE));
  RAW_CONFIG.listen.port = 0;
  if (RAW_CONFIG.health && RAW_CONFIG.health['heartbeat-path']) {
    RAW_CONFIG.health['heartbeat-path'].value = HEARTBEAT_PATH;
  }
  RAW_CONFIG['gc-log'].enabled = false;
};

restoreConfig();

export const getHeartbeatPath = function () {
  return HEARTBEAT_PATH;
};

export const makeAndStartServer = async function (cb) {
  const config = libConfig.fromObject(RAW_CONFIG);
  const SERVICE_VERSION = libUtil.readVersion();
  const serverOpts = {
    config,
    logmgr: log4js,
    version: SERVICE_VERSION,
  };

  const server = new Server(serverOpts);
  await server._configureMiddlewareAndRoutes();
  server.once('listening', (listenInfo) => {
    cb(server, listenInfo.httpServer);
  });
  server.once('error', (err) => {
    console.log(err);
  });
  server.run();
};
