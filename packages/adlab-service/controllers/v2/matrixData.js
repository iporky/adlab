import {
  uploadMatrixData,
  findByPersonaConfigId,
  deleteMatrixData,
  updateMatrixData as updateMatrixDataService,
} from '../../services/v2/matrixData.js';
import { getPersonaConfigById } from '../../services/v2/personaConfig.js';

/**
 * Handles matrix data upload from Excel file
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export async function uploadMatrixDataHandler(req, res) {
  const { logger } = req.app.locals;

  try {
    if (!req.file) {
      return res.status(400).json({
        code: 'INVALID_REQUEST',
        reason: 'No file uploaded',
      });
    }

    const { personaConfigId } = req.params;

    // Verify persona config exists
    const personaConfig = await getPersonaConfigById(personaConfigId);
    if (!personaConfig) {
      return res.status(404).json({
        code: 'NOT_FOUND',
        reason: 'Persona config not found',
      });
    }

    // Process and save matrix data
    const savedData = await uploadMatrixData(personaConfigId, req.file, req.jwt?.claims?.uid || 'system');

    logger.info('Successfully saved matrix data:', {
      id: savedData._id,
      personaConfigId: savedData.personaConfigId,
    });

    res.status(201).json({
      _id: savedData._id,
      personaConfigId: savedData.personaConfigId,
      data: savedData.data,
      format: savedData.format,
      createdBy: savedData.createdBy,
      updatedBy: savedData.updatedBy,
      createdOn: savedData.createdOn,
      updatedOn: savedData.updatedOn,
    });
  } catch (error) {
    logger.error('Error processing matrix data:', error);
    res.status(500).json({
      code: 'INTERNAL_ERROR',
      reason: 'Error processing matrix data',
    });
  }
}

/**
 * Deletes matrix data by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export async function deleteMatrixDataHandler(req, res) {
  const { matrixDataId, personaConfigId } = req.params;
  const { logger } = req.app.locals;

  try {
    const matrixData = await findByPersonaConfigId(personaConfigId);

    // Verify the matrix data belongs to the specified persona config and matches the ID
    if (matrixData._id.toString() !== matrixDataId) {
      return res.status(404).json({
        code: 'NOT_FOUND',
        reason: 'Matrix data not found for this persona config',
      });
    }

    // Delete the matrix data
    await deleteMatrixData(matrixDataId);
    res.status(200).json({ message: 'Matrix data deleted successfully' });
  } catch (error) {
    logger.error('Error deleting matrix data:', error);
    res.status(500).json({
      code: 'INTERNAL_ERROR',
      reason: error.message,
    });
  }
}

/**
 * Gets matrix data by personaConfigId
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export async function getMatrixData(req, res) {
  const { personaConfigId } = req.params;
  const { logger } = req.app.locals;

  try {
    const matrixData = await findByPersonaConfigId(personaConfigId);
    res.status(200).json(matrixData);
  } catch (error) {
    logger.error('Error fetching matrix data:', error);
    if (error.message === 'Matrix data not found') {
      return res.status(404).json({
        code: 'NOT_FOUND',
        reason: error.message,
      });
    }
    res.status(500).json({
      code: 'INTERNAL_ERROR',
      reason: 'Error fetching matrix data',
    });
  }
}

/**
 * Updates matrix data by ID (Full update - PUT)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export async function updateMatrixDataHandler(req, res) {
  const { matrixDataId } = req.params;
  const { logger } = req.app.locals;

  try {
    logger.info('Incoming PUT request:', {
      hasFile: !!req.file,
      fileInfo: req.file
        ? {
            fieldname: req.file.fieldname,
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
          }
        : null,
    });

    if (!req.file) {
      return res.status(400).json({
        code: 'INVALID_REQUEST',
        reason: 'No file uploaded',
      });
    }

    // Update the matrix data with new file (full replacement)
    const updatedData = await updateMatrixDataService(matrixDataId, req.file, req.jwt?.claims?.uid || 'system');

    res.status(200).json(updatedData);
  } catch (error) {
    logger.error('Error in updateMatrixData:', error);
    if (error.message === 'Matrix data not found') {
      return res.status(404).json({
        code: 'NOT_FOUND',
        reason: error.message,
      });
    }
    res.status(500).json({
      code: 'INTERNAL_ERROR',
      reason: error.message,
    });
  }
}

/**
 * Partially updates matrix data by ID (Partial update - PATCH)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export async function patchMatrixDataHandler(req, res) {
  const { matrixDataId } = req.params;
  const { logger } = req.app.locals;

  try {
    logger.info('Incoming PATCH request:', {
      hasFile: !!req.file,
      fileInfo: req.file
        ? {
            fieldname: req.file.fieldname,
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
          }
        : null,
    });

    if (!req.file) {
      return res.status(400).json({
        code: 'INVALID_REQUEST',
        reason: 'No file uploaded',
      });
    }

    // Update the matrix data with new file (partial update)
    const updatedData = await updateMatrixDataService(matrixDataId, req.file, req.jwt?.claims?.uid || 'system');

    res.status(200).json(updatedData);
  } catch (error) {
    logger.error('Error in patchMatrixData:', error);
    if (error.message === 'Matrix data not found') {
      return res.status(404).json({
        code: 'NOT_FOUND',
        reason: error.message,
      });
    }
    res.status(500).json({
      code: 'INTERNAL_ERROR',
      reason: error.message,
    });
  }
}
