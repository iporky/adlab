import { getUserContextFromReq } from '../../lib/util.js';
import * as permissionsService from '../../services/v1/permissions.js';

/**
 * Get user permissions for the given oidc provider user id
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
export const getUserPermissions = async function (req, res, next) {
  try {
    const { logger, _config: config } = req.app.locals;
    const { userId } = getUserContextFromReq(req);
    if (!userId) {
      logger.error('User context not found');
      return res.status(400).json({ error: 'Invalid user context' });
    }

    const userPermissions = await permissionsService.getUserPermissions({
      userId,
      logger,
      config,
    });
    if (!userPermissions) {
      const error = new Error('Data not found');
      error.status = 404;
      throw error;
    }
    return res.status(200).json(userPermissions);
  } catch (error) {
    req.app.locals.logger.error('Error occurred in getUserPermissions service', {
      error,
    });
    return res.status(error.status || 500).json({ error: error.message });
  }
};
