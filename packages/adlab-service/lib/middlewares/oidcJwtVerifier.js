import OktaJwtVerifier from '@okta/jwt-verifier';
import * as Constants from '../constants.js';
import { parseURLFromRequest, loadJSON } from '../util.js';

const localSecrets = loadJSON('../config/local-secrets.json');

/**
 * Middleware to verify JWT token and set jwt in request object
 * @param app
 */
export const configureOIDCJwtVerifier = (app) => {
  const logger = app.locals.logger;
  const _config = app.locals._config;

  logger.info('Configuring OIDC JWT Verifier');

  const oktaJwtVerifier = new OktaJwtVerifier({
    issuer: _config.get(Constants.OIDC_ISSUER),
    clientId: _config.get(Constants.OIDC_CLIENT_ID),
  });

  app.use(async (req, res, next) => {
    try {
      const { context } = parseURLFromRequest(req);

      const apiKey = req.headers[Constants.X_TFS_SERVICE_API_KEY];
      if (apiKey && apiKey === localSecrets['service-api-key']) {
        logger.info('Authenticated via service api key');
        req.isApiKeyAuthenticated = true;
        next();
        return;
      }

      // If the route is unprotected, skip the JWT verification
      if (_config.get(Constants.UNPROTECTED_ROUTES).includes(context)) {
        next();
        return;
      }

      const { authorization } = req.headers;
      if (!authorization) throw new Error('You must send an Authorization header');

      const [authType, token] = authorization.trim().split(' ');
      if (authType !== 'Bearer') throw new Error('Expected a Bearer token');

      const jwt = await oktaJwtVerifier.verifyAccessToken(token, 'api://default');
      req.jwt = jwt;
      logger.info('JWT Verification Successful', { jwt });
      next();
    } catch (error) {
      logger.error('Error in JWT Verification: ', error);
      res.status(401).send('There was an error verifying the JWT token');
    }
  });
};
