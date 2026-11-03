import Assert from '@tfs/node-assert';
import * as Constants from '../constants.js';

export const configureCSPHandler = (app) => {
  const logger = app.locals.logger;
  const _config = app.locals._config;

  const cspConfigEnabled = _config.get(Constants.IS_CSP_ENABLED);

  if (!cspConfigEnabled) return;

  logger.info('Server Content Security Policy enabled. Setting up CSP headers...');

  Assert.isObject(_config.get(Constants.CSP_DIRECTIVES), Constants.CSP_DIRECTIVES);

  const cspDirectives = _config.get(Constants.CSP_DIRECTIVES);

  app.use((req, res, next) => {
    res.setHeader(
      'Content-Security-Policy',
      Object.keys(cspDirectives).reduce((acc, key) => `${acc}${key} ${cspDirectives[key].join(' ')}; `, ''),
    );
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    next();
  });
};
