import cors from 'cors';
import Assert from '@tfs/node-assert';
import { URL } from 'url';
import * as Constants from '../constants.js';

/**
 * Configures CORS for the server
 * TODO: Update with Helmet package for security headers
 * @param app
 */
export const configureCorsHandler = (app) => {
  const logger = app.locals.logger;
  const _config = app.locals._config;

  Assert.notEmpty(_config.get(Constants.ALLOWED_HOSTNAMES_REGEX), Constants.ALLOWED_HOSTNAMES_REGEX);
  const allowedHostnamesRegex = new RegExp(_config.get(Constants.ALLOWED_HOSTNAMES_REGEX));

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin
        if (!origin || origin === 'null') {
          return callback(null, true);
        }

        try {
          const originUrl = new URL(origin);
          const originHostname = originUrl.hostname;
          const isAllowed = allowedHostnamesRegex.test(originHostname);

          if (isAllowed) {
            callback(null, true);
          } else {
            logger.warn('server_cors_rejected', { origin });
            callback(new Error(`Origin ${origin} not allowed by CORS`));
          }
        } catch (error) {
          logger.error('server_cors_parse_error', { origin, error: error.message });
          callback(new Error(`Invalid origin format: ${origin}`));
        }
      },
      methods: 'GET,POST,PUT,DELETE,PATCH',
      preflightContinue: false,
      optionsSuccessStatus: 204,
    })
  );
};
