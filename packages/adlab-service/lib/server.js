/*
 * 24/7 Customer, Inc. Confidential, Do Not Distribute. This is an
 * unpublished, proprietary work which is fully protected under
 * copyright law. This code may only be used pursuant to a valid
 * license from 24/7 Customer, Inc.
 */
'use strict';

import compression from 'compression';
import express from 'express';
import fs from 'fs';
import path, { dirname } from 'path';
import Assert from '@tfs/node-assert';
import libCorr from '@tfs/node-service-correlators';
import { BaseObject } from '@tfs/node-baseobject';
import { SessionLogger } from '@tfs/node-sessionlogger';
import { makeSummarizer } from '@tfs/node-request-summary';
import { fileURLToPath } from 'url';
import * as cache from './drivers/cache.js';
import { establishDBConnection, closeDBConnection, isDBReplicaSet } from './drivers/database.js';
import * as Constants from './constants.js';
import * as libUtil from './util.js';

import { configureCorsHandler } from './middlewares/corsHandler.js';
import { configureCSPHandler } from './middlewares/cspHandler.js';
import { configureOIDCJwtVerifier } from './middlewares/oidcJwtVerifier.js';
import { configureSwaggerTools } from './middlewares/swaggerSetup.js';
import { configureAuthorityVerifier } from './middlewares/authorityVerifier.js';
import { configureRequestContentParser } from './middlewares/requestContentParser.js';
import { configureSSEMiddleware } from './middlewares/sseEmitterHandler.js';
import { watchTokenConfigChanges } from '../services/v1/tokenConfigs.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * The server
 * @class
 * @param {Object} opts Options for creating the server
 * @memberof module:server
 */
class Server extends BaseObject {
  constructor(opts) {
    // Validate options
    Assert.isObject(opts, 'opts');
    Assert.isObject(opts.config, 'opts.config');
    Assert.isObject(opts.logmgr, 'opts.logmgr');

    super(opts.logmgr, 'SRVR');

    // Log server booting
    this.logger.info('bootstrapping server...');

    // Initialize properties
    this._config = opts.config;
    this._logmgr = opts.logmgr;
    this.listenPort = this._config.getNumber(Constants.LISTEN_PORT_CONFIG_KEY);
    Assert.isNumberInclusive(this.listenPort, Constants.LISTEN_PORT_CONFIG_KEY, 0);
    this.keepAliveTimeout = this._config.getNumber(Constants.KEEPALIVE_TIMEOUT_CONFIG_KEY);
    if (this.keepAliveTimeout !== undefined) {
      Assert.isNumberInclusive(this.keepAliveTimeout, Constants.KEEPALIVE_TIMEOUT_CONFIG_KEY, 0);
    }
    this.requestTimeout = this._config.getNumber(Constants.REQUEST_TIMEOUT_CONFIG_KEY);
    if (this.requestTimeout !== undefined) {
      Assert.isNumberInclusive(this.requestTimeout, 'listen.requestTimeout', 0);
    }
    this._version = opts.version;
    this._heartbeatPath = this._config.get(Constants.HEARTBEAT_PATH_CONFIG_KEY);
    Assert.notEmpty(this._heartbeatPath, Constants.HEARTBEAT_PATH_CONFIG_KEY);
    this._heartbeatPath = path.resolve(`${__dirname}/../`, this._heartbeatPath);
    this.logger.info('health check', { path: this._heartbeatPath });

    // Initialize server and express app
    this._server = undefined;
    const app = express();
    this.app = app;
    Assert.notEmpty(app.get('env'), 'set NODE_ENV before startup');
    this._alive = undefined;
    this.app.locals.logger = this;
    this.app.locals._config = this._config;
    this.app.disable(Constants.X_POWERED_BY);
    this.app.set('etag', false);

    cache.init({ logger: this });

    (async () => {
      establishDBConnection(this.app).then(async () => {
        try {
          isDBReplicaSet(this.app).then(async (isReplicaSet) => {
            cache.put({
              logger: this,
              key: Constants.IS_DB_REPLICA_SET_CACHE_KEY,
              value: isReplicaSet,
            });
            await watchTokenConfigChanges(this.logger);
          });
        } catch (error) {
          this.logger.error('Error watching token config changes in db', {
            error,
          });
        }
      });
    })();
  }

  /**
   * Starts the server's HTTP listener(s)
   */
  run() {
    this._alive = true;
    this._server = this.app.listen(this.listenPort, () => {
      this.app.locals.logger.info('listening', {
        port: this._server.address().port,
        version: this._version,
        env: this.app.get('env'),
        keepAliveTimeout: this._server.keepAliveTimeout,
        requestTimeout: this._server.timeout,
      });

      this.emit('listening', { httpServer: this._server });
    });

    if (this.keepAliveTimeout !== undefined) {
      this._server.keepAliveTimeout = this.keepAliveTimeout;
    }
    if (this.requestTimeout !== undefined) {
      this._server.timeout = this.requestTimeout;
    }
    this._server.once('close', () => {
      this.emit('close');
    });
  }

  async _configureMiddlewareAndRoutes() {
    const app = this.app;
    configureCorsHandler(this.app);
    configureCSPHandler(this.app);
    this.app.use(compression());
    configureSSEMiddleware(this.app);

    if (this._config.get(Constants.IS_SECURITY_ENABLED)) {
      this.app.locals.logger.info('server_okta_enabled');
      configureOIDCJwtVerifier(this.app);
    } else {
      this.app.locals.logger.info('server_okta_disabled');
    }

    app.use(libCorr.addTransactionId);
    app.use(makeSummarizer({ logger: this, serviceVersion: this._version }));

    // log cross-service correlatives
    app.use(
      libCorr.makeLogger({
        logger: this,
        serviceVersion: this._version,
      })
    );

    /*
     * Install a per-request logger that injects current transaction/session id
     * into the metadata of each log event
     */
    app.use((req, res, next) => {
      req.logger = new SessionLogger({
        logmgr: this._logmgr,
        request: req,
        logregion: Constants.LOG_REGION,
      });
      next();
    });

    // Configure request parser
    configureRequestContentParser(this.app);

    // Configure routes
    configureAuthorityVerifier(this.app);
    await configureSwaggerTools(this.app);

    // health check
    app.use('/v1/health', (req, res, next) => {
      fs.stat(this._heartbeatPath, (err, stats) => {
        libUtil.makeNonCacheable(res).set(Constants.X_SERVICE_VERSION_HEADER, this._version);
        if (err) {
          res.status(404).end();
        } else {
          res.set('Content-Type', 'text/plain').end('OK');
        }
      });
    });
  }

  /**
   * Terminates the server
   * @param  {string} [reason] The reason for termination
   */
  close(reason) {
    if (!this._alive) {
      /* eslint-disable no-console */
      console.log('The process might still be alive due to open TCP connections. Committing suicide...');
      (async () => closeDBConnection(this.app))();
      process.exit(1);
    }

    this.app.locals.logger.info(`Shutting down due to ${reason}...`);
    this._alive = false;

    (async () => closeDBConnection(this.app))();
    this._server.close();
  }

  /* eslint-disable class-methods-use-this */
  toString() {
    return '';
  }
}

export { Server };
