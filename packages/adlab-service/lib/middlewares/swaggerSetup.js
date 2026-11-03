import express from 'express';
import swaggerTools from '@tfs/swagger-tools-wrapper';

import { configureErrorHandler } from './errorHandler.js';
import { exportConfig as swaggerDocsV1 } from './swaggerDocsv1.js';
import { exportConfig as swaggerDocsV2 } from './swaggerDocsv2.js';
import apiRouter from './apiRouter.js';

/**
 * Configures swagger tools for the server
 * @returns {Promise<void>}
 */
export const configureSwaggerTools = async (app) => {
  const { logger } = app.locals;

  logger.info('Configuring swagger tools');

  const errorHandler = () => {
    logger.info('Setting up error handler middleware...');
    app.use(configureErrorHandler.bind(this));
  };

  const { docs: docsV1, pathToControllers: pathToControllersV1 } = swaggerDocsV1();
  const { docs: docsV2, pathToControllers: pathToControllersV2 } = swaggerDocsV2();

  // Mount API router first to ensure multer handles file uploads
  app.use('/v2', apiRouter);

  // Configure swagger tools with relaxed validation
  const options = {
    controllers: pathToControllersV2,
    useStubs: false,
    trimOptions: { maxDepth: 2 },
    swaggerUi: true,
    validateResponse: false,
    validateRequest: {
      allowUnknownQueryParameters: true,
      validateContentType: false,
    },
  };

  // Initialize v1 swagger middleware
  await swaggerTools.initializeMiddleware(
    app,
    docsV1,
    pathToControllersV1,
    errorHandler,
    {
      trimOptions: { maxDepth: 2 },
      validateRequest: {
        validateContentType: false,
      },
    },
    express
  );

  // Add request logging middleware
  app.use((req, res, next) => {
    logger.info('Request details:', {
      method: req.method,
      path: req.path,
      contentType: req.headers['content-type'],
      body: req.body,
    });
    next();
  });

  // Initialize v2 swagger middleware after router
  await swaggerTools.initializeMiddleware(app, docsV2, pathToControllersV2, errorHandler, options, express);
};
