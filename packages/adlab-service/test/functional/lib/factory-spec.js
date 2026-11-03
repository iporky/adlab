/*
 * 24/7 Customer, Inc. Confidential, Do Not Distribute. This is an
 * unpublished, proprietary work which is fully protected under
 * copyright law. This code may only be used pursuant to a valid
 * license from 24/7 Customer, Inc.
 */
'use strict';

import assert from 'assert';
import request from 'supertest';
import fs from 'fs';
import log4js from 'log4js';
import libConfig from '@tfs/node-config';
import * as libUtil from '../../../lib/util';
import * as TestUtil from '../../__helpers__/test-util';
import { makeAndRun } from '../../../lib/factory';
import RAW_CONFIG from '../../../config/service-template.json';

RAW_CONFIG.listen.port = 12345;

const config = libConfig.fromObject(RAW_CONFIG);
const SERVICE_VERSION = libUtil.readVersion();
const serverOpts = {
  config,
  logmgr: log4js,
  version: SERVICE_VERSION,
};

describe('factory created server', () => {
  beforeEach(() => {
    fs.writeFileSync(TestUtil.getHeartbeatPath(), 'OK');
  });

  it('should start and test the server', async () => {
    const { server, httpServer } = await makeAndRun(serverOpts);
    assert(server, 'server');
    const res = await request(httpServer).get('/v1/health').expect(200);
    assert.equal(res.type, 'text/plain');
    assert.equal(res.text, 'OK');
    server.close('die');
  });

  it('should return a 404 for an invalid route', async () => {
    const { server, httpServer } = await makeAndRun(serverOpts);
    assert(server, 'server');
    await request(httpServer).get('/v1/foobar').expect(401);
    server.close('die');
  });
});
