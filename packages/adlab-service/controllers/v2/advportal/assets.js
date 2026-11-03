import AdvportalAdapter from '../../../../../packages/adlab-adapters/src/advportal/index.js';
import { MEDIA_TYPE } from '../../../../../packages/adlab-adapters/src/constants/mediaTypes.js';
import * as TemplateService from '../../../services/v2/template.js';
import { getUserContextFromReq } from '../../../lib/util.js';
import * as Constants from '../../../lib/constants.js';

/**
 * Creates adapter with correct config (env or _config fallback)
 */
function createAdapter(req) {
  const config = req.app?.locals?._config;
  let baseUrl = process.env.ADVPORTAL_BASE_URL;
  if (!baseUrl && config) {
    baseUrl = config.get(Constants.ADVPORTAL_BASE_URL);
  }

  return new AdvportalAdapter({
    apiBaseUrl: baseUrl,
    accessToken: 'dummy-token',
  });
}

/**
 * GET /assets/folders
 */
export async function getAllFolders(req, res) {
  const { logger } = req.app.locals;
  const adapter = createAdapter(req);
  try {
    const folders = await adapter.getFolders();
    res.json({ data: folders });
  } catch (err) {
    logger.error('Error fetching folders:', err);
    res.status(500).json({ error: 'Failed to fetch folders' });
  }
}

/**
 * GET /assets/images/:folderId
 */
export async function getImageAssetByFolder(req, res) {
  const { logger } = req.app.locals;
  const { folderId } = req.params;
  const adapter = createAdapter(req);
  try {
    const asset = await adapter.getFiles({ folderId: Number(folderId), mediaType: MEDIA_TYPE.IMAGE });
    res.json(asset);
  } catch (err) {
    logger.error('Error fetching image asset:', err);
    res.status(500).json({ error: 'Failed to fetch image asset' });
  }
}

/**
 * GET /assets/videos/:folderId
 */
export async function getVideoAssetByFolder(req, res) {
  const { logger } = req.app.locals;
  const { folderId } = req.params;
  const adapter = createAdapter(req);
  try {
    const asset = await adapter.getFiles({ folderId: Number(folderId), mediaType: MEDIA_TYPE.VIDEO });
    res.json(asset);
  } catch (err) {
    logger.error('Error fetching video asset:', err);
    res.status(500).json({ error: 'Failed to fetch video asset' });
  }
}

/**
 * GET /assets/templates/:folderId
 */
export async function getTemplateAssetByFolder(req, res) {
  const { logger } = req.app.locals;
  const { folderId } = req.params;
  const adapter = createAdapter(req);
  try {
    const asset = await adapter.getFiles({ folderId: Number(folderId), mediaType: MEDIA_TYPE.TEMPLATE });
    res.json(asset);
  } catch (err) {
    logger.error('Error fetching template asset:', err);
    res.status(500).json({ error: 'Failed to fetch template asset' });
  }
}

/**
 * GET /assets/template/:orgId/:templateId
 */
export async function getTemplateJson(req, res) {
  const { orgId, templateId } = req.params;
  const logger = req.app.locals.logger;
  const config = req.app.locals._config;

  try {
    const json = await TemplateService.fetchTemplateJson(orgId, templateId, config, logger);
    return res.status(200).json(json);
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Failed to proxy template JSON' });
  }
}


