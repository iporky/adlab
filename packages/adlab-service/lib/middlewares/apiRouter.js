import express from 'express';
import multer from 'multer';

// Import targeting type controllers
import { getTargetingsForType } from '../../controllers/v2/targetings/types/{targetingType}.js';
import { getAudienceTargeting } from '../../controllers/v2/targetings/types/audience.js';
import { getDeviceTargeting } from '../../controllers/v2/targetings/types/device.js';
import { getContentTargeting } from '../../controllers/v2/targetings/types/content.js';
import { getPlacementTargeting } from '../../controllers/v2/targetings/types/placement.js';
import { getTimingTargeting } from '../../controllers/v2/targetings/types/timing.js';
import { getAgeTargeting } from '../../controllers/v2/targetings/types/age.js';
import { getLanguageTargeting } from '../../controllers/v2/targetings/types/languages.js';

// Import campaign type controllers
import { getCampaignForType } from '../../controllers/v2/campaigns/types/{campaignType}.js';
import { getCampaignObjectiveGoals } from '../../controllers/v2/campaigns/types/goals.js';
import { getCampaignObjectives } from '../../controllers/v2/campaigns/types/objectives.js';
import { getCampaignStatus } from '../../controllers/v2/campaigns/types/status.js';
import { getCampaignBudgetTypes } from '../../controllers/v2/campaigns/types/budgetType.js';
import { getCampaignBudgetPacing } from '../../controllers/v2/campaigns/types/budgetPacing.js';
import { getCampaignCurrency } from '../../controllers/v2/campaigns/types/currency.js';
import { getCampaignTypes } from '../../controllers/v2/campaigns/types/campaignType.js';
import { getCampaignFormats } from '../../controllers/v2/campaigns/types/campaignFormat.js';

// Import persona config controllers
import {
  createPersonaConfig,
  getPersonaConfig,
  updatePersonaConfig,
  patchPersonaConfig,
  deletePersonaConfig,
} from '../../controllers/v2/personaConfig.js';

// Import targeting controllers
import { createTargeting, getAllTargetingForCampaign } from '../../controllers/v2/targetings.js';
import {
  getTargetingById,
  updateTargetingById,
  deleteTargetingById,
  patchTargetingById,
} from '../../controllers/v2/targetings/{targetingId}.js';

// Import campaign controllers
import { createCampaign, getAllCampaignsForClient } from '../../controllers/v2/campaigns.js';
import {
  getCampaignById,
  updateCampaignById,
  deleteCampaignById,
  patchCampaignById,
} from '../../controllers/v2/campaigns/{campaignId}.js';

// Import matrix data controllers
import {
  uploadMatrixDataHandler,
  getMatrixData,
  updateMatrixDataHandler,
  patchMatrixDataHandler,
  deleteMatrixDataHandler,
} from '../../controllers/v2/matrixData.js';

// Import advportal adapter controller
import adapterRouter from './adapterRouter.js';


const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
    ];

    if (validTypes.includes(file.mimetype)) {
      if (req.app.locals.logger) {
        req.app.locals.logger.info('File type accepted:', file.mimetype);
      }
      cb(null, true);
    } else {
      if (req.app.locals.logger) {
        req.app.locals.logger.error('Invalid file type:', file.mimetype);
      }
      cb(new Error(`Invalid file type. Allowed types: ${validTypes.join(', ')}`));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// Campaign type routes (specific routes first)
router.get('/campaigns/types/goals', getCampaignObjectiveGoals);
router.get('/campaigns/types/objectives', getCampaignObjectives);
router.get('/campaigns/types/status', getCampaignStatus);
router.get('/campaigns/types/budgetType', getCampaignBudgetTypes);
router.get('/campaigns/types/budgetPacing', getCampaignBudgetPacing);
router.get('/campaigns/types/currency', getCampaignCurrency);
router.get('/campaigns/types/campaignType', getCampaignTypes);
router.get('/campaigns/types/campaignFormat', getCampaignFormats);
router.get('/campaigns/types/:campaignType', getCampaignForType);

// Targeting type routes (specific routes first)
router.get('/campaigns/targetings/types/audience', getAudienceTargeting);
router.get('/campaigns/targetings/types/device', getDeviceTargeting);
router.get('/campaigns/targetings/types/content', getContentTargeting);
router.get('/campaigns/targetings/types/placement', getPlacementTargeting);
router.get('/campaigns/targetings/types/timing', getTimingTargeting);
router.get('/campaigns/targetings/types/age', getAgeTargeting);
router.get('/campaigns/targetings/types/languages', getLanguageTargeting);
router.get('/campaigns/targetings/types/:targetingType', getTargetingsForType);

// Campaign routes (parameter routes after specific routes)
router.post('/campaigns', createCampaign);
router.get('/campaigns', getAllCampaignsForClient);
router.get('/campaigns/:campaignId', getCampaignById);
router.put('/campaigns/:campaignId', updateCampaignById);
router.patch('/campaigns/:campaignId', patchCampaignById);
router.delete('/campaigns/:campaignId', deleteCampaignById);

// Persona Config routes
router.post('/campaigns/:campaignId/personaconfig', createPersonaConfig);
router.get('/campaigns/:campaignId/personaconfig', getPersonaConfig);
router.put('/campaigns/:campaignId/personaconfig/:personaConfigId', updatePersonaConfig);
router.patch('/campaigns/:campaignId/personaconfig/:personaConfigId', patchPersonaConfig);
router.delete('/campaigns/:campaignId/personaconfig/:personaConfigId', deletePersonaConfig);

// Targeting routes
router.post('/campaigns/:campaignId/targetings', createTargeting);
router.get('/campaigns/:campaignId/targetings', getAllTargetingForCampaign);
router.get('/campaigns/:campaignId/targetings/:targetingId', getTargetingById);
router.put('/campaigns/:campaignId/targetings/:targetingId', updateTargetingById);
router.patch('/campaigns/:campaignId/targetings/:targetingId', patchTargetingById);
router.delete('/campaigns/:campaignId/targetings/:targetingId', deleteTargetingById);

// Matrix data routes
router.post(
  '/campaigns/:campaignId/personaconfig/:personaConfigId/matrixdata',
  upload.single('file'),
  uploadMatrixDataHandler
);
router.get('/campaigns/:campaignId/personaconfig/:personaConfigId/matrixdata', getMatrixData);
router.put(
  '/campaigns/:campaignId/personaconfig/:personaConfigId/matrixdata/:matrixDataId',
  upload.single('file'),
  updateMatrixDataHandler
);
router.patch(
  '/campaigns/:campaignId/personaconfig/:personaConfigId/matrixdata/:matrixDataId',
  upload.single('file'),
  patchMatrixDataHandler
);
router.delete(
  '/campaigns/:campaignId/personaconfig/:personaConfigId/matrixdata/:matrixDataId',
  deleteMatrixDataHandler
);

router.use('/advportal', adapterRouter);



export default router;
