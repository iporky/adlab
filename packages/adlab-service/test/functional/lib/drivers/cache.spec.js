import { jest } from '@jest/globals';
import {
  get, init, put, remove, clear, keys, _DO_NOT_USE_IN_PROD_printCache // eslint-disable-line camelcase
} from '../../../../lib/drivers/cache';

describe('cache tests', () => {
  let logger;

  beforeEach(() => {
    logger = {
      info: jest.fn(),
    };
    init({ logger });
  });

  it('should put value into cache', () => {
    put({ logger, key: 'test-key', value: 'test-value' });
    const value = get({ logger, key: 'test-key' });
    expect(value).toEqual('test-value');
  });

  it('should get value from cache', () => {
    put({ logger, key: 'test-key', value: 'test-value' });
    const value = get({ logger, key: 'test-key' });
    expect(value).toEqual('test-value');
  });

  it('should remove value from cache', () => {
    put({ logger, key: 'test-key', value: 'test-value' });
    remove({ logger, key: 'test-key' });
    const value = get({ logger, key: 'test-key' });
    expect(value).toBeUndefined();

    remove({ logger, key: 'test-key' });
    expect(logger.info).toHaveBeenCalledWith('key test-key not found in cache');
  });

  it('should clear all entries from cache', () => {
    put({ logger, key: 'test-key', value: 'test-value' });

    let value = get({ logger, key: 'test-key' });
    expect(value).toEqual('test-value');

    clear({ logger });

    value = get({ logger, key: 'test-key' });
    expect(value).toBeUndefined();
  });

  it('should return undefined when getting non-existing key', () => {
    const value = get({ logger, key: 'non-existing-key' });
    expect(value).toBeUndefined();
  });

  it('should return all keys from cache', () => {
    put({ logger, key: 'key1', value: 'value1' });
    put({ logger, key: 'key2', value: 'value2' });

    const cacheKeys = keys({ logger });

    expect(Array.from(cacheKeys)).toEqual(['key2', 'key1']);
    expect(logger.info).toHaveBeenCalledWith('fetching all keys from cache');
  });

  describe('_DO_NOT_USE_IN_PROD_printCache', () => {
    let mockLogger;

    beforeEach(() => {
      mockLogger = {
        warn: jest.fn(),
        log: jest.fn(),
      };
    });

    it('should print warning when cache is empty', () => {
      clear({ logger }); // ensure cache is empty
      _DO_NOT_USE_IN_PROD_printCache({ logger: mockLogger });

      expect(mockLogger.warn).toHaveBeenCalledWith('Do not use this function in production');
      expect(mockLogger.log).toHaveBeenCalledWith('Cache is empty');
    });

    it('should print cache entries when cache is not empty', () => {
      put({ logger, key: 'test1', value: 'value1' });
      put({ logger, key: 'test2', value: 'value2' });

      _DO_NOT_USE_IN_PROD_printCache({ logger: mockLogger });

      expect(mockLogger.warn).toHaveBeenCalledWith('Do not use this function in production');
      expect(mockLogger.log).toHaveBeenCalledWith('Printing Cache entries...');
      expect(mockLogger.log).toHaveBeenCalledWith({ test1: 'value1' });
      expect(mockLogger.log).toHaveBeenCalledWith({ test2: 'value2' });
    });
  });
});
