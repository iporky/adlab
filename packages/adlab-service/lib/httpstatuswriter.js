/*
 * 24/7 Customer, Inc. Confidential, Do Not Distribute. This is an
 * unpublished, proprietary work which is fully protected under
 * copyright law. This code may only be used pursuant to a valid
 * license from 24/7 Customer, Inc.
 */
'use strict';

import Assert from '@tfs/node-assert';

const HEADERS = {
  'Content-Type': 'text/xml',
  'Cache-Control': 'no-cache',
  Pragma: 'no-cache',
};

/**
 * Constructs an object that writes status data to an HTTP response object
 *
 * @param {Object} response An HTTP response
 */
class HttpStatusWriter {
  constructor(response) {
    Assert.isObject(response, 'response');

    this._response = response;
    this._response.writeHead(200, HEADERS);
  }

  /*
   * Writes the data
   *
   * @data The data to write
   */
  write(data) {
    this._response.write(data);
    return this;
  }

  /*
   * Writes the data
   *
   * @data The data to write
   */
  writeln(data) {
    if (data) {
      this._response.write(data);
      this._response.write('\n');
    }

    return this;
  }

  /*
   * closes the HTTP response
   *
   * @data The data to write
   */
  end() {
    this._response.end();
  }
}

export { HttpStatusWriter };
