import Assert from '@tfs/node-assert';
import mongoose from 'mongoose';
import * as Constants from '../constants.js';

export const db = mongoose;

/**
 * Establish connection to MongoDB
 */
export const establishDBConnection = async (app) => {
  if (db.connection.readyState === 1) {
    app.locals.logger.info('MongoDB connection is already established');
    return;
  }

  Assert.notEmpty(app.locals._config.get(Constants.DB_CONNECTION_URL));
  Assert.notEmpty(app.locals._config.get(Constants.DB_NAME));
  Assert.isNumber(app.locals._config.get(Constants.DB_CONNECTION_TIMEOUT));
  Assert.isNumber(app.locals._config.get(Constants.DB_CONNECTION_SOCKET_TIMEOUT));

  let dbConnectionUrl;

  if (process.env.MONGODB_URL && process.env.DB_NAME) {
    dbConnectionUrl = `${process.env.MONGODB_URL}/${process.env.DB_NAME}`;
  } else {
    dbConnectionUrl = `${app.locals._config.get(Constants.DB_CONNECTION_URL)}/${app.locals._config.get(Constants.DB_NAME)}`;
  }

  try {
    await mongoose.connect(dbConnectionUrl, {
      connectTimeoutMS: app.locals._config.get(Constants.DB_CONNECTION_TIMEOUT),
      socketTimeoutMS: app.locals._config.get(Constants.DB_CONNECTION_SOCKET_TIMEOUT),
    });

    app.locals.logger.info('Connected to MongoDB');
  } catch (err) {
    app.locals.logger.error('Failed to connect to MongoDB', err);
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    }
  }
};

/**
 * Close connection to MongoDB
 * @param app
 */
export const closeDBConnection = async (app) => {
  try {
    await mongoose.connection.close();
    app.locals.logger.info('MongoDB connection closed');
  } catch (err) {
    app.locals.logger.error('Failed to close MongoDB connection', err);
    try {
      await mongoose.connection.close();
      app.locals.logger.info('MongoDB connection closed by force');
    } catch (err2) {
      app.locals.logger.error('Failed to close MongoDB connection by force', err2);
    }
  }
};

/**
 * Check if the database is a replica set
 * @param {Object} app - The application object containing configuration and logger
 * @returns {Promise<boolean>}
 */
export const isDBReplicaSet = async (app) => {
  if (db.connection.readyState !== 1) {
    throw new Error('Migration Error: No db connection found');
  }

  try {
    const admin = mongoose.connection.db.admin();
    const replStatus = await admin.replSetGetStatus();
    return replStatus.ok === 1;
  } catch (error) {
    app.locals.logger.error('Error checking if DB is a replica set:', error);
    return false;
  }
};
