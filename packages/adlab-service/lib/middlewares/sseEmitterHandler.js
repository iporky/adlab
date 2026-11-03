import { eventEmitter } from '../eventsEmitter.js';

/**
 * Server Sent Event Middleware
 * @param app
 */
export const configureSSEMiddleware = (app) => {
  const { logger } = app.locals;

  logger.info('Setting SSE Middleware...');

  const sseSetup = (res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
  };

  const sseSend = (res, data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
    res.flush();
  };

  app.use((req, res, next) => {
    res.sseSetup = () => sseSetup(res);
    res.sseSend = (data) => sseSend(res, data);
    next();
  });

  app.get('/v1/events', (req, res) => {
    const action = req.query.action;
    logger.info(`SSE: /v1/events?action=${action}`);
    res.sseSetup();

    const listener = (data) => {
      res.sseSend(data);
    };

    eventEmitter.on(action, listener);

    req.on('close', () => {
      eventEmitter.off(action, listener);
    });
  });
};
