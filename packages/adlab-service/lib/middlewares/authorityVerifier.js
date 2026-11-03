import * as Constants from '../constants.js';
import { getUserPermissionsFromDB } from '../../dal/userPermissionsDAL.js';
import { getUserContextFromReq, parseURLFromRequest } from '../util.js';

const methodToPermissionsMapping = {
  get: ['read'],
  post: ['create'],
  put: ['update'],
  patch: ['update'],
  delete: ['delete'],
  options: ['read'],
};

const subContextToParentContextMapping = {
  ads: 'campaigns',
};

/**
 * Middleware to verify user authority to perform the action
 * @param app
 */
export const configureAuthorityVerifier = function (app) {
  const { logger } = app.locals;

  logger.info('Setting Authority Verifier Middleware...');

  ['get', 'post', 'put', 'patch', 'delete', 'options'].forEach((method) => {
    app[method]('*', async (req, res, next) => {
      const { _config } = req.app.locals;

      try {
        const { context, resourceId, action } = parseURLFromRequest(req);
        logger.info(`Request method: ${method}, path: ${context}`);

        if (
          _config.get(Constants.UNPROTECTED_ROUTES).includes(context) ||
          _config.get(Constants.AUTHORIZED_ROUTES).includes(context) ||
          req.isApiKeyAuthenticated
        ) {
          logger.info('Request is for unprotected or authorized route');
          next();
          return;
        }

        const { userId, clientId, accountId } = getUserContextFromReq(req);

        if (!userId || !clientId || !accountId) {
          logger.error('User context not found');
          res.status(403).send('Forbidden');
          // eslint-disable-next-line
          return;
        }
        next();

        // TODO: fix permissions using UMS
        // const userPermissions = await getUserPermissionsFromDB({
        //   userId,
        //   logger,
        // });

        // if (!userPermissions) {
        //   logger.error('User permissions not found');
        //   res.status(403).send('Forbidden');
        //   return;
        // }

        // const userPermissionsForAccount = userPermissions.clients[clientId].accounts[accountId].permissions;

        // const permissionsRequiredForMethod = methodToPermissionsMapping[method];

        // const parentContext = subContextToParentContextMapping[context];

        // if (parentContext) {
        //   logger.info(`Parent context '${parentContext}' exists for context '${context}'`);
        // }

        // const permission = `${parentContext || context}.${
        //   resourceId && action ? action : permissionsRequiredForMethod
        // }`;

        // logger.info(`Permission required: ${permission}`);

        // if (userPermissionsForAccount.includes(permission)) {
        //   next();
        // } else {
        //   res.status(403).send('User has no authority to perform this action');
        // }
      } catch (error) {
        req.app.locals.logger.error(`Error occurred in authorityVerifier middleware, ${error.message}`);
        res.status(500).send('Error occurred in verifying user authority to perform the action.');
      }
    });
  });
};
