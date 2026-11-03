/*
 * 24/7 Customer, Inc. Confidential, Do Not Distribute. This is an
 * unpublished, proprietary work which is fully protected under
 * copyright law. This code may only be used pursuant to a valid
 * license from 24/7 Customer, Inc.
 */
'use strict';
import Assert from '@tfs/node-assert';
import cors from 'cors';
import express from 'express';
import { BaseObject } from '@tfs/node-baseobject';
import { HttpStatusWriter } from './httpstatuswriter.js';

const XML_PROLOG = '<?xml version="1.0" encoding="UTF-8"?>';

class StatusServer extends BaseObject {
  constructor(opts) {
    Assert.isObject(opts, 'opts');
    Assert.isObject(opts.owner, 'opts.owner');
    Assert.isObject(opts.config, 'opts.config');
    Assert.isObject(opts.logmgr, 'opts.logmgr');

    super(opts.logmgr, 'STATUS');

    this.app = express();

    this._statusPort = opts.config.get('status.port', 8082);
    this._owner = opts.owner;

    this.setupMiddleware();
    this.setupRoutes();
  }

  setupMiddleware() {
    const app = this.app;

    app.use(cors());

    app.use((err, req, res, next) => {
      const code = err.code || 500;
      if (code === 500) {
        this.error(err.stack);
      } else {
        this.info(err.message);
      }

      res.status(code).end();
    });
  }

  setupRoutes() {
    this.app.get('/', (req, res, next) => {
      this.handleStatusRequest(req, res, next);
    });
  }

  handleStatusRequest(req, res) {
    const writer = new HttpStatusWriter(res);

    writer.writeln(XML_PROLOG);
    writer.writeln('<status>');
    this._owner.getStatus(writer);
    writer.writeln('</status>');
    writer.end();
  }

  run() {
    this._server = this.app.listen(this._statusPort, () => {
      const addr = this._server.address();
      this.info('listening', { port: addr.port });
    });
  }

  close() {
    this._server.close();
  }
}

export { StatusServer };
