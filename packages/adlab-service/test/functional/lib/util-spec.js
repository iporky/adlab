/*
 * 24/7 Customer, Inc. Confidential, Do Not Distribute. This is an
 * unpublished, proprietary work which is fully protected under
 * copyright law. This code may only be used pursuant to a valid
 * license from 24/7 Customer, Inc.
 */
'use strict';

import assert from 'assert';
import * as libUtil from '../../../lib/util';
import * as Constants from '../../../lib/constants';

describe('util', () => {
  describe('parseBool', () => {
    it('should behave as expected', (done) => {
      try {
        libUtil.parseBool(undefined, 'foo');
        assert.fail('Should have thrown exception');
      } catch (e) {
        // ignore; expected
      }

      // test defVal
      assert.equal(libUtil.parseBool(undefined, undefined), undefined);
      assert.equal(libUtil.parseBool(undefined, true), true);
      assert.equal(libUtil.parseBool(undefined, false), false);

      // test raw vals
      assert.equal(libUtil.parseBool('true'), true);
      assert.equal(libUtil.parseBool('on'), true);
      assert.equal(libUtil.parseBool('yes'), true);
      assert.equal(libUtil.parseBool('false'), false);
      assert.equal(libUtil.parseBool('off'), false);
      assert.equal(libUtil.parseBool('no'), false);
      assert.equal(libUtil.parseBool('foo'), undefined);
      assert.equal(libUtil.parseBool('foo', false), false);
      done();
    });
  });

  describe('parseInt', () => {
    it('should behave as expected', (done) => {
      try {
        libUtil.parseInteger(undefined, 'foo');
        assert.fail('Should have thrown exception');
      } catch (e) {
        // ignore; expected
      }

      // test defVal
      assert.equal(libUtil.parseInt(undefined, undefined), undefined);
      assert.equal(libUtil.parseInt(undefined, 10), 10);

      // test raw vals
      assert.equal(libUtil.parseInt('10'), 10);
      assert.equal(libUtil.parseInt(714), 714);
      assert.equal(libUtil.parseInt('foo'), undefined);
      assert.equal(libUtil.parseInt('foo', 11), 11);
      assert.equal(libUtil.parseInt('12.7567'), 12);
      assert.equal(libUtil.parseInt('12.7890', 13), 12);
      done();
    });
  });

  describe('parsePosInt', () => {
    it('should behave as expected', (done) => {
      assert.equal(libUtil.parsePosInt(undefined, 'foo', undefined), undefined);
      try {
        libUtil.parsePosInt(undefined, 'foo', 'foo');
        assert.fail('Should have thrown exception');
      } catch (e) {
        // ignore; expected
      }

      try {
        libUtil.parsePosInt(undefined, 'foo', '-5');
        assert.fail('Should have thrown exception');
      } catch (e) {
        // ignore; expected
      }

      // test defVal
      assert.equal(libUtil.parsePosInt(undefined, 'foo', 10), 10);
      assert.equal(libUtil.parsePosInt(undefined, 'foo', 7), 7);

      // test raw vals
      try {
        libUtil.parsePosInt('bar', 'foo');
        assert.fail('Should have thrown exception');
      } catch (e) {
        // ignore; expected
      }
      try {
        libUtil.parsePosInt(-3, 'foo');
        assert.fail('Should have thrown exception');
      } catch (e) {
        // ignore; expected
      }

      assert.equal(libUtil.parsePosInt(6, 'foo'), 6);
      assert.equal(libUtil.parsePosInt(12, 'foo'), 12);
      done();
    });
  });

  describe('jsonToObject', () => {
    const emptyJson = '{}';
    const goodJson = '{"parent": "foo", "children": [{"child": "bar1"}, {"child": "bar2"}]}';
    const expectedGood = {
      parent: 'foo',
      children: [{ child: 'bar1' }, { child: 'bar2' }],
    };

    const badJson = '{"parent": "foo", "children": [{"child": "bar1"},]}';

    it('should behave as expected', (done) => {
      libUtil.jsonToObject(emptyJson, (err, obj) => {
        assert.equal(err, undefined);
        assert.deepStrictEqual(obj, {});
      });

      libUtil.jsonToObject(undefined, (err, obj) => {
        assert.equal(err, undefined);
        assert.equal(obj, undefined);
      });

      libUtil.jsonToObject(goodJson, (err, obj) => {
        assert.equal(err, undefined);
        assert.deepStrictEqual(obj, expectedGood);
      });

      libUtil.jsonToObject(badJson, (err, obj) => {
        assert(err);
        assert.equal(obj, undefined);
      });

      done();
    });
  });

  describe('formatSeconds', () => {
    it('should behave as expected', (done) => {
      assert.equal(libUtil.formatSeconds(54).units, 'seconds');
      assert.equal(libUtil.formatSeconds(54).value, '54.00');
      assert.equal(libUtil.formatSeconds(607).units, 'minutes');
      assert.equal(libUtil.formatSeconds(607).value, '10.12');
      assert.equal(libUtil.formatSeconds(60755).units, 'hours');
      assert.equal(libUtil.formatSeconds(60755).value, '16.88');
      assert.equal(libUtil.formatSeconds(6075512).units, 'days');
      assert.equal(libUtil.formatSeconds(6075512).value, '70.32');
      done();
    });
  });

  describe('getBareContentTypeFromHeader', () => {
    it('should behave as expected', (done) => {
      assert.equal(libUtil.getBareContentTypeFromHeader(), undefined);
      assert.equal(libUtil.getBareContentTypeFromHeader('application/x-foo'), 'application/x-foo');
      assert.equal(libUtil.getBareContentTypeFromHeader('application/x-foo; utf-8'), 'application/x-foo');
      done();
    });
  });

  describe('getUserContextFromReq', () => {
    it('should return correct user context from request', () => {
      const req = {
        jwt: {
          claims: {
            uid: 'testUserId',
          },
        },
        headers: {
          [Constants.X_TFS_CLIENT_ID]: 'testClientId',
          [Constants.X_TFS_ACCOUNT_ID]: 'testAccountId',
        },
      };

      const result = libUtil.getUserContextFromReq(req);
      expect(result).toEqual({
        userId: 'testUserId',
        clientId: 'testClientId',
        accountId: 'testAccountId',
      });
    });

    it('should throw error when jwt is not an object', () => {
      const req = {
        jwt: 'notAnObject',
        headers: {},
      };
      try {
        libUtil.getUserContextFromReq(req);
      } catch (err) {
        expect(err.message).toEqual('object expected');
      }
    });

    it('should throw error when headers is not an object', () => {
      const req = {
        jwt: {
          claims: {},
        },
        headers: 'notAnObject',
      };

      try {
        libUtil.getUserContextFromReq(req);
      } catch (err) {
        expect(err.message).toEqual('Error getting user context: object expected');
      }
    });
  });

  describe('parseURLFromRequest', () => {
    it('should return correct parsed URL from request', () => {
      const req = {
        path: '/v1/context/id/action',
        headers: {
          host: 'localhost:3000',
        },
      };

      const result = libUtil.parseURLFromRequest(req);
      assert.deepEqual(result, {
        version: 'v1',
        context: 'context',
        resourceId: 'id',
        action: 'action',
      });
    });

    it('should return correct parsed URL when resourceId and action are not present', () => {
      const req = {
        path: '/v1/context',
        headers: {
          host: 'localhost:3000',
        },
      };

      const result = libUtil.parseURLFromRequest(req);
      assert.deepEqual(result, {
        version: 'v1',
        context: 'context',
        resourceId: undefined,
        action: undefined,
      });
    });

    it('should return correct parsed URL when action is not present', () => {
      const req = {
        path: '/v1/context/id',
        headers: {
          host: 'localhost:3000',
        },
      };

      const result = libUtil.parseURLFromRequest(req);
      assert.deepEqual(result, {
        version: 'v1',
        context: 'context',
        resourceId: 'id',
        action: undefined,
      });
    });
  });

  describe('extractFromProcessArgvs test', () => {
    it('should return arguments from process.argv', () => {
      const testProcessArgvs = ['DB_URL=test://test:123', 'DB_NAME=testdb'];
      const testArgs = ['DB_URL', 'DB_NAME'];
      const result = libUtil.extractFromProcessArgvs(testProcessArgvs, testArgs);
      assert.deepEqual(result, { DB_URL: 'test://test:123', DB_NAME: 'testdb' });
    });
  });

  describe('validateDBObjectId', () => {
    it('should throw error if id is not a valid ObjectId', () => {
      const id = 'invalidId';
      try {
        libUtil.validateDBObjectId(id, 'campaignId');
      } catch (error) {
        expect(error.message).toBe('Invalid Campaign Id');
      }
    });

    it('should not throw error if id is a valid ObjectId', () => {
      const id = '5f5f2c3f6b9b1c001f6c9e3d';
      expect(() => libUtil.validateDBObjectId(id)).not.toThrow();
    });
  });

  describe('libUtil.validateStringForNoSQLInjection', () => {
    it('should throw an error if value is not a string', () => {
      expect(() => libUtil.validateStringForNoSQLInjection(123, 'clientId')).toThrow('Invalid Client Id');
    });

    it('should throw an error if value is an empty string', () => {
      expect(() => libUtil.validateStringForNoSQLInjection('', 'clientId')).toThrow('Invalid Client Id');
    });

    it('should throw an error if value is a string with only spaces', () => {
      expect(() => libUtil.validateStringForNoSQLInjection('   ', 'clientId')).toThrow('Invalid Client Id');
    });

    it('should throw an error if value contains $ character', () => {
      expect(() => libUtil.validateStringForNoSQLInjection('cli$entId', 'clientId')).toThrow(
        'Invalid characters in Client Id',
      );
    });

    it('should throw an error if value contains . character', () => {
      expect(() => libUtil.validateStringForNoSQLInjection('client.Id', 'clientId')).toThrow(
        'Invalid characters in Client Id',
      );
    });

    it('should trim leading and trailing spaces', () => {
      const result = libUtil.validateStringForNoSQLInjection('  clientId  ', 'clientId');
      expect(result).toBe('clientId');
    });

    it('should return the sanitized string if it is valid', () => {
      const result = libUtil.validateStringForNoSQLInjection('validClientId', 'clientId');
      expect(result).toBe('validClientId');
    });
  });

  describe('libUtil.getObjectDiff', () => {
    it('should return empty changes and unset for identical objects', () => {
      const a = { key1: 'value1', key2: 'value2' };
      const b = { key1: 'value1', key2: 'value2' };
      const result = libUtil.getObjectDiff(a, b);
      expect(result).toEqual({ changes: {}, unset: {} });
    });

    it('should return changes for different values', () => {
      const a = { key1: 'value1', key2: 'value2' };
      const b = { key1: 'value1', key2: 'newValue2' };
      const result = libUtil.getObjectDiff(a, b);
      expect(result).toEqual({ changes: { key2: 'newValue2' }, unset: {} });
    });

    it('should return unset for missing keys in b', () => {
      const a = { key1: 'value1', key2: 'value2' };
      const b = { key1: 'value1' };
      const result = libUtil.getObjectDiff(a, b);
      expect(result).toEqual({ changes: {}, unset: { key2: '' } });
    });

    it('should return changes and unset for nested objects', () => {
      const a = { key1: { subKey1: 'subValue1', subKey2: 'subValue2' }, key2: 'value2' };
      const b = { key1: { subKey1: 'subValue1', subKey2: 'newSubValue2' }, key2: 'newValue2', key3: 'newValue3' };
      const result = libUtil.getObjectDiff(a, b);
      expect(result).toEqual({
        changes: { key1: { subKey1: 'subValue1', subKey2: 'newSubValue2' }, key2: 'newValue2', key3: 'newValue3' },
        unset: {},
      });
    });

    it('should return changes and unset for arrays', () => {
      const a = { key1: ['value1', 'value2'] };
      const b = { key1: ['value1', 'newValue2'] };
      const result = libUtil.getObjectDiff(a, b);
      expect(result).toEqual({ changes: { key1: ['value1', 'newValue2'] }, unset: {} });
    });

    it('should return changes for different types', () => {
      const a = { key1: 'value1' };
      const b = { key1: 1 };
      const result = libUtil.getObjectDiff(a, b);
      expect(result).toEqual({ changes: { key1: 1 }, unset: {} });
    });

    it('should return changes and unset for complex objects', () => {
      const a = { key1: { subKey1: 'subValue1', subKey2: 'subValue2' }, key2: 'value2', key3: 'value3' };
      const b = { key1: { subKey1: 'subValue1' }, key2: 'newValue2' };
      const result = libUtil.getObjectDiff(a, b);
      expect(result).toEqual({
        changes: { key1: { subKey1: 'subValue1' }, key2: 'newValue2' },
        unset: { key3: '' },
      });
    });

    it('should return changes and unset for complex objects with arrays', () => {
      const a = {
        key1: { subKey1: 'subValue1', subKey2: { key1: ['value1', 'newValue2'] } },
        key2: 'value2',
        key3: 'value3',
      };
      const b = { key1: { subKey1: 'subValue1', subKey2: { key1: ['value1', 'newValue3'] } }, key2: 'newValue2' };
      const result = libUtil.getObjectDiff(a, b);
      expect(result).toEqual({
        changes: { key1: { subKey1: 'subValue1', subKey2: { key1: ['value1', 'newValue3'] } }, key2: 'newValue2' },
        unset: { key3: '' },
      });
    });
  });
});
