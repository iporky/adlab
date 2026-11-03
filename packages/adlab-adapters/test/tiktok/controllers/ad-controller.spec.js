import { jest } from '@jest/globals';
import { AdController } from '../../../src/controllers/AdController.js';

describe('AdController', () => {
  let adController;
  let adApiMock;
  const advertiserId = 'testAdvertiserId';
  const accessToken = 'testAccessToken';
  const opts = {
    query: {
      ad_ids: 'testAdId',
    },
  };
  const expectedGetAdRequest = {
    filtering: {
      ad_ids: ['testAdId'],
    },
  };

  beforeEach(() => {
    adApiMock = {
      adGet: jest.fn(),
      adCreate: jest.fn(),
      adUpdate: jest.fn(),
      adStatusUpdate: jest.fn(),
    };
    adController = new AdController(adApiMock, advertiserId, accessToken);
  });

  describe('getAd', () => {
    it('should call adApi.adGet with correct parameters', () => {
      const callback = jest.fn();

      adController.getAd(opts, callback);

      expect(adApiMock.adGet).toHaveBeenCalledWith(
        advertiserId,
        accessToken,
        expectedGetAdRequest,
        expect.any(Function),
      );
    });

    it('should pass the error and data to callback in handleResponse', () => {
      const callback = jest.fn();
      const error = null;
      const data = { success: true };

      adApiMock.adGet.mockImplementation((_, __, ___, cb) => cb(error, data));

      adController.getAd(opts, callback);

      expect(callback).toHaveBeenCalledWith(error, data);
    });
  });

  describe('createAd', () => {
    it('should call adApi.adCreate with correct parameters', () => {
      const callback = jest.fn();

      adController.createAd(opts, callback);

      expect(adApiMock.adCreate).toHaveBeenCalledWith(accessToken, opts, expect.any(Function));
    });

    it('should pass the error and data to callback in handleResponse', () => {
      const callback = jest.fn();
      const error = null;
      const data = { success: true };

      adApiMock.adCreate.mockImplementation((_, __, cb) => cb(error, data));

      adController.createAd(opts, callback);

      expect(callback).toHaveBeenCalledWith(error, data);
    });
  });

  describe('updateAd', () => {
    it('should call adApi.adUpdate with correct parameters', () => {
      const callback = jest.fn();

      adController.updateAd(opts, callback);

      expect(adApiMock.adUpdate).toHaveBeenCalledWith(accessToken, opts, expect.any(Function));
    });

    it('should pass the error and data to callback in handleResponse', () => {
      const callback = jest.fn();
      const error = null;
      const data = { success: true };

      adApiMock.adUpdate.mockImplementation((_, __, cb) => cb(error, data));

      adController.updateAd(opts, callback);

      expect(callback).toHaveBeenCalledWith(error, data);
    });
  });

  describe('deleteAd', () => {
    it('should call updateAd with correct parameters', () => {
      const callback = jest.fn();

      const updateAdSpy = jest.spyOn(adController, 'updateAd');

      adController.deleteAd(opts, callback);

      expect(updateAdSpy).toHaveBeenCalledWith(opts, callback);
    });
  });

  describe('patchAd', () => {
    it('should call adApi.adStatusUpdate with correct parameters', () => {
      const callback = jest.fn();

      adController.patchAd(opts, callback);

      expect(adApiMock.adStatusUpdate).toHaveBeenCalledWith(accessToken, opts, expect.any(Function));
    });

    it('should pass the error and data to callback in handleResponse', () => {
      const callback = jest.fn();
      const error = null;
      const data = { success: true };

      adApiMock.adStatusUpdate.mockImplementation((_, __, cb) => cb(error, data));

      adController.patchAd(opts, callback);

      expect(callback).toHaveBeenCalledWith(error, data);
    });
  });
});
