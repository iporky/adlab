import express from 'express';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { jest } from '@jest/globals';
import swaggerTools from '@tfs/swagger-tools-wrapper';
import libConfig from '@tfs/node-config';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import extend from 'extend';
import RAW_CONFIG from '../../config/service-template.json';
import * as Constants from '../../lib/constants';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

RAW_CONFIG.listen.port = 1234;
const config = libConfig.fromObject(RAW_CONFIG);

let server;
let mongodb;

const setupSwaggerServer = async (swaggerDoc) => {
  const app = express();

  app.use((req, res, next) => {
    req.jwt = {
      claims: {
        uid: 'mock-uid',
      },
    };
    next();
  });

  const mergedSwaggerDoc = extend(true, {}, swaggerDoc, {
    info: {
      title: 'adlab',
    },
    securityDefinitions: {
      authToken: {
        type: 'apiKey',
        in: 'header',
        name: 'Authorization',
        description: 'Requests should pass Authorization Bearer token in header.',
      },
    },
    parameters: {
      clientId: {
        name: Constants.X_TFS_CLIENT_ID,
        description: 'client identifier',
        in: 'header',
        required: true,
        type: 'string',
      },
      accountId: {
        name: Constants.X_TFS_ACCOUNT_ID,
        description: 'account identifier',
        in: 'header',
        required: true,
        type: 'string',
      },
    },
  });

  await swaggerTools.initializeMiddleware(
    app,
    mergedSwaggerDoc,
    `${__dirname}/../../controllers/v1`,
    () => {},
    { trimOptions: { maxDepth: 2 } },
    express,
  );

  app.locals = {
    logger: {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
    },
    _config: config,
  };

  server = app.listen(config.get('port'), () => {
    console.log(`Server is running on port ---> ${config.get('listen.port')}`);
  });

  return app;
};

const setupDatabase = async (dbSetupCallback) => {
  mongodb = await MongoMemoryServer.create();
  const dbUri = mongodb.getUri();
  await mongoose.connect(dbUri);
  mongoose.connection.on('connected', async () => {
    console.log('db connection is now open');
    if (dbSetupCallback) {
      await dbSetupCallback();
    }
  });
};

const tearDownDatabase = async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.close();
    console.log('db connection closed');
  }
  await mongodb?.stop();
};

const tearDownServer = async () => {
  if (server) {
    await server.close();
    console.log('Server closed at port ---> ', config.get('listen.port'));
  }
};

export {
  setupSwaggerServer, setupDatabase, tearDownDatabase, tearDownServer
};
