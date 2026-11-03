import express from 'express';
import {
  getAllFolders,
  getImageAssetByFolder,
  getVideoAssetByFolder,
  getTemplateAssetByFolder,
  getTemplateJson,
} from '../../controllers/v2/advportal/assets.js';

const router = express.Router();

router.get('/assets/folders', getAllFolders);
router.get('/assets/images/:folderId', getImageAssetByFolder);
router.get('/assets/videos/:folderId', getVideoAssetByFolder);
router.get('/assets/templates/:folderId', getTemplateAssetByFolder);
router.get('/assets/template/:orgId/:templateId', getTemplateJson);

export default router;
