import { jest } from '@jest/globals';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import libConfig from '@tfs/node-config';
import { closeDBConnection, establishDBConnection, isDBReplicaSet } from '../../../../lib/drivers/database';
import RAW_CONFIG from '../../../../config/service-template.json';

let mongodb;
let mockApp;

describe('database tests', () => {
  beforeAll(async () => {
    mongodb = await MongoMemoryServer.create();
    RAW_CONFIG.database.connection_url = mongodb.getUri();
    mockApp = {
      locals: {
        _config: libConfig.fromObject(RAW_CONFIG),
        logger: {
          info: jest.fn(),
          error: jest.fn(),
        },
      },
    };
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongodb.stop();
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    // Ensure clean connection state before each test
    await mongoose.disconnect();
  });

  describe('connection establishment', () => {
    it('should establish a database connection', async () => {
      await establishDBConnection(mockApp);
      expect(mockApp.locals.logger.info).toHaveBeenCalledWith('Connected to MongoDB');
    });

    it('should skip establishing connection if already connected', async () => {
      await establishDBConnection(mockApp);
      expect(mockApp.locals.logger.info).toHaveBeenCalledWith('Connected to MongoDB');

      mockApp.locals.logger.info.mockClear();

      await establishDBConnection(mockApp);
      expect(mockApp.locals.logger.info).toHaveBeenCalledWith('MongoDB connection is already established');
    });

    it('should use environment variables for connection if provided', async () => {
      const originalEnv = process.env;
      process.env.MONGODB_URL = 'mongodb://localhost:27017';
      process.env.DB_NAME = 'test_db';

      try {
        await establishDBConnection(mockApp);
        expect(mockApp.locals.logger.info).toHaveBeenCalledWith('Connected to MongoDB');
      } finally {
        process.env = originalEnv;
      }
    });

    it('should handle database connection error', async () => {
      const connectionError = new Error('Connection error');
      const originalConnect = mongoose.connect;
      mongoose.connect = jest.fn().mockRejectedValue(connectionError);

      try {
        await establishDBConnection(mockApp);
      } catch (err) {
        expect(mockApp.locals.logger.error).toHaveBeenCalledWith('Failed to connect to MongoDB', connectionError);
      } finally {
        mongoose.connect = originalConnect;
      }
    });

    it('should exit process when connection fails in non-test environment', async () => {
      const connectionError = new Error('Connection error');
      const originalConnect = mongoose.connect;
      const originalNodeEnv = process.env.NODE_ENV;
      const originalExit = process.exit;

      mongoose.connect = jest.fn().mockRejectedValue(connectionError);
      process.env.NODE_ENV = 'production';
      process.exit = jest.fn();

      try {
        await establishDBConnection(mockApp);
        expect(mockApp.locals.logger.error).toHaveBeenCalledWith('Failed to connect to MongoDB', connectionError);
        expect(process.exit).toHaveBeenCalledWith(1);
      } finally {
        mongoose.connect = originalConnect;
        process.env.NODE_ENV = originalNodeEnv;
        process.exit = originalExit;
      }
    });
  });

  describe('connection closure', () => {
    beforeEach(async () => {
      // Ensure we have a connection before testing closure
      await establishDBConnection(mockApp);
      jest.clearAllMocks();
    });

    it('should close a database connection', async () => {
      await closeDBConnection(mockApp);
      expect(mockApp.locals.logger.info).toHaveBeenCalledWith('MongoDB connection closed');
    });

    it('should handle database disconnection error', async () => {
      const disconnectionError = new Error('Disconnection error');
      const originalClose = mongoose.connection.close;
      mongoose.connection.close = jest.fn().mockRejectedValue(disconnectionError);

      try {
        await closeDBConnection(mockApp);
      } catch (err) {
        expect(err).toEqual(disconnectionError);
        expect(mockApp.locals.logger.error).toHaveBeenCalledWith(
          'Failed to close MongoDB connection',
          disconnectionError,
        );
      } finally {
        mongoose.connection.close = originalClose;
      }
    });

    it('should attempt force close when normal close fails', async () => {
      const firstError = new Error('First close attempt failed');
      const secondError = new Error('Force close failed');
      const originalClose = mongoose.connection.close;

      mongoose.connection.close = jest
        .fn()
        .mockRejectedValueOnce(firstError)
        .mockRejectedValueOnce(secondError);

      try {
        await closeDBConnection(mockApp);
        expect(mockApp.locals.logger.error).toHaveBeenCalledWith(
          'Failed to close MongoDB connection',
          firstError
        );
        expect(mockApp.locals.logger.error).toHaveBeenCalledWith(
          'Failed to close MongoDB connection by force',
          secondError
        );
      } finally {
        mongoose.connection.close = originalClose;
      }
    });

    it('should log success when force close works', async () => {
      const firstError = new Error('First close attempt failed');
      const originalClose = mongoose.connection.close;

      mongoose.connection.close = jest
        .fn()
        .mockRejectedValueOnce(firstError)
        .mockResolvedValueOnce();

      try {
        await closeDBConnection(mockApp);
        expect(mockApp.locals.logger.error).toHaveBeenCalledWith(
          'Failed to close MongoDB connection',
          firstError
        );
        expect(mockApp.locals.logger.info).toHaveBeenCalledWith(
          'MongoDB connection closed by force'
        );
      } finally {
        mongoose.connection.close = originalClose;
      }
    });
  });

  describe('replica set checks', () => {
    it('should throw error if no database connection exists', async () => {
      await expect(isDBReplicaSet(mockApp))
        .rejects
        .toThrow('Migration Error: No db connection found');
    });

    it('should return true for replica set', async () => {
      await establishDBConnection(mockApp);
      const mockAdmin = {
        replSetGetStatus: jest.fn().mockResolvedValue({ ok: 1 }),
      };
      const originalAdmin = mongoose.connection.db.admin;

      try {
        jest.spyOn(mongoose.connection.db, 'admin').mockReturnValue(mockAdmin);
        const result = await isDBReplicaSet(mockApp);
        expect(result).toBe(true);
      } finally {
        mongoose.connection.db.admin = originalAdmin;
      }
    });

    it('should return false when replSetGetStatus fails', async () => {
      await establishDBConnection(mockApp);
      const mockAdmin = {
        replSetGetStatus: jest.fn().mockRejectedValue(new Error('Not a replica set')),
      };
      const originalAdmin = mongoose.connection.db.admin;

      try {
        jest.spyOn(mongoose.connection.db, 'admin').mockReturnValue(mockAdmin);
        const result = await isDBReplicaSet(mockApp);
        expect(result).toBe(false);
        expect(mockApp.locals.logger.error).toHaveBeenCalledWith(
          'Error checking if DB is a replica set:',
          expect.any(Error)
        );
      } finally {
        mongoose.connection.db.admin = originalAdmin;
      }
    });
  });
});
