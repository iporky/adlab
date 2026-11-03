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
import { makeAndStartServer, getHeartbeatPath } from '../../__helpers__/test-util';

describe('server', () => {
  beforeAll(() => {
    fs.writeFileSync(getHeartbeatPath(), 'OK');
  });

  it('should start and stop the server', async () => {
    await makeAndStartServer((server, httpServer) => {
      assert(server, 'server');
      assert(httpServer, 'httpServer');
      server.close('die');
    });
  });

  it('should GET /v1/health', async () => {
    await makeAndStartServer((server, httpServer) => {
      request(httpServer)
        .get('/v1/health')
        .expect(200)
        .end((err, res) => {
          assert(!err, err);
          assert.equal(res.type, 'text/plain');
          assert.equal(res.text, 'OK');
          server.close('die');
        });
    });
  });

  it('should return a 404 for an invalid route', async () => {
    await makeAndStartServer((server, httpServer) => {
      request(httpServer)
        .get('/v1/foobar')
        .expect(404)
        .end((err, res) => {
          assert(!err, err);
          server.close('die');
        });
    });
  });
});
