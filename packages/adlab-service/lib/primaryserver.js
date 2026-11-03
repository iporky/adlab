'use strict';

import Assert from '@tfs/node-assert';
import cluster from 'cluster';
import { BaseObject } from '@tfs/node-baseobject';
import { StatusServer } from './statusserver.js';
import * as libUtil from './util.js';

const STATE_STARTING = Symbol('starting');
const STATE_RUNNING = Symbol('running');
const STATE_STOPPING = Symbol('stopping');

const SHUTDOWN_MSECS = 10000;

class PrimaryServer extends BaseObject {
  constructor(opts) {
    Assert.isObject(opts, 'opts');
    Assert.isObject(opts.logmgr, 'opts.logmgr');
    Assert.isNumberInclusive(opts.totalWorkers, 'opts.totalWorkers', 1);

    super(opts.logmgr, 'MSRVR');

    this.totalWorkers = opts.totalWorkers;
    this.version = libUtil.readVersion();

    this.activeSessions = 0;
    this.totalSessions = 0;
    this.sessionErrorsInit = 0;
    this.sessionErrorsRuntime = 0;
    this.abnormalWorkerExits = 0;

    this.startTime = new Date().toISOString();

    this._state = STATE_STARTING;

    this._statusServer = new StatusServer({
      owner: this,
      logmgr: opts.logmgr,
      config: opts.config,
    });
  }

  run() {
    const self = this;

    this._statusServer.run();

    let onlineCount = 0;

    cluster.on('error', (e) => {
      this.error(e.message);
    });

    cluster.on('exit', (worker, code, signal) => {
      onlineCount -= 1;
      // OMNI-576: log pipeline expects code to be a number
      if (code === null) {
        code = undefined;
      }

      const workerInfo = {
        pid: worker.process.pid,
        code,
        signal,
        duration: Date.now() - worker.startTime, // total worker lifetime
      };

      if (this._state === STATE_STOPPING) {
        this.info('worker.exit', workerInfo);
        if (onlineCount === 0) {
          this.emit('close');
        }
      } else {
        this.abnormalWorkerExits += 1;
        this.warn('worker.exit', workerInfo);
        if (this._state === STATE_RUNNING) {
          // unexpected child exit during operation; start another
          this.info('worker.restart');
          cluster.fork();
        }
      }
    });

    cluster.on('online', (worker) => {
      worker.startTime = Date.now();
      worker.on('message', onWorkerEvent);
      onlineCount += 1;
      if (onlineCount === this.totalWorkers) {
        this._state = STATE_RUNNING;
        this.info('listening', {
          port: undefined,
          version: this.version,
          env: process.env.NODE_ENV,
          workers: this.totalWorkers,
        });
      }
    });

    for (let i = 0; i < this.totalWorkers; i++) {
      cluster.fork();
    }

    function onWorkerEvent(event) {
      // HACKHACK: ignore log4js '::log4js:message' events
      if (event.topic) {
        return;
      }

      self._handleWorkerEvent(event);
    }

    process.on('SIGTERM', () => {
      this._state = STATE_STOPPING;
      this.info('stopping', { maxwait: SHUTDOWN_MSECS });
      sendToWorkers({ name: 'shutdown' });
      const timer = setTimeout(() => {
        process.exit(1);
      }, SHUTDOWN_MSECS);
      timer.unref();
    });
  }

  _handleWorkerEvent(event) {
    switch (event.name) {
    case 'session.started':
    case 'session.resumed':
      this.activeSessions += 1;
      this.totalSessions += 1;
      break;
    case 'session.done':
    case 'session.suspended':
      this.activeSessions -= 1;
      break;
    case 'session.error.init':
      // NB: session was neither started nor resumed
      this.sessionErrorsInit += 1;
      break;
    case 'session.error.runtime':
      this.sessionErrorsRuntime += 1;
      this.activeSessions -= 1;
      break;
    default:
      this.warn(`unrecognized worker event ${event.name}`);
    }
  }

  getStatus(writer) {
    const uptimeObj = libUtil.formatSeconds(process.uptime());

    writer.writeln(`  <versions>
    <browser>${this.version}</browser>
    <node>${process.version}</node>
    <v8>${process.versions.v8}</v8>
  </versions>
  <starttime>${this.startTime}</starttime>
  <workers>
    <count>${this.totalWorkers}</count>
    <abnormalexits>${this.abnormalWorkerExits}</abnormalexits>
  </workers>
  <uptime units='${uptimeObj.units}'>${uptimeObj.value}</uptime>
  <sessions>
    <active>${this.activeSessions}</active>
    <total>${this.totalSessions}</total>
    <errors>
      <init>${this.sessionErrorsInit}</init>
      <runtime>${this.sessionErrorsRuntime}</runtime>
    </errors>
  </sessions>`);

    const memUsage = process.memoryUsage();
    Object.entries(memUsage).forEach((entry) => {
      const tagName = entry[0].toLowerCase();
      writer.writeln(`  <${tagName}><![CDATA[${entry[1]}]]></${tagName}>`);
    });
  }
}

/**
 * Sends an event to all workers
 * @param  {Object} event An event
 */
function sendToWorkers(event) {
  Object.values(cluster.workers).forEach((worker) => {
    worker.send(event);
  });
}

export { PrimaryServer };
