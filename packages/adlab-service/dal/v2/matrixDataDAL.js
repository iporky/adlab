import { MatrixDataModel } from './schemas/matrixData.js';
import { validateDBObjectId } from '../../lib/util.js';

/**
 * Create a new matrix data entry
 * @param {Object} params - Parameters for creating matrix data
 * @param {Object} params.matrixData - Matrix data to save
 * @param {string} params.personaConfigId - Persona config ID
 * @param {string} params.createdBy - User creating the matrix data
 * @returns {Promise<Object>} Created matrix data
 */
export async function createMatrixDataInDB({ matrixData, personaConfigId, createdBy }) {
  validateDBObjectId(personaConfigId, 'personaConfigId');

  const matrixDataDoc = new MatrixDataModel({
    ...matrixData,
    personaConfigId,
    createdBy,
  });

  return matrixDataDoc.save();
}

/**
 * Update an existing matrix data entry
 * @param {string} matrixDataId - ID of the matrix data to update
 * @param {Object} updateData - Data to update
 * @param {Object} updateData.matrixData - Matrix data to update
 * @param {string} updateData.updatedBy - User updating the matrix data
 * @returns {Promise<Object>} Updated matrix data
 */
export async function updateMatrixDataInDB(matrixDataId, { matrixData, updatedBy }) {
  validateDBObjectId(matrixDataId, 'matrixDataId');

  return MatrixDataModel.findByIdAndUpdate(
    matrixDataId,
    {
      $set: {
        ...matrixData,
        updatedBy,
        updatedOn: Date.now(),
      },
    },
    { new: true, runValidators: true }
  ).exec();
}

/**
 * Patch a matrix data entry with partial data
 * @param {string} matrixDataId - Matrix data ID
 * @param {Object} params - Update parameters
 * @param {Object} params.matrixData - Partial matrix data to update
 * @param {string} params.updatedBy - User updating the matrix data
 * @returns {Promise<Object>} Updated matrix data
 */
export async function patchMatrixDataInDB(matrixDataId, { matrixData, updatedBy }) {
  validateDBObjectId(matrixDataId, 'matrixDataId');

  return MatrixDataModel.findByIdAndUpdate(
    matrixDataId,
    {
      $set: {
        ...matrixData,
        updatedBy,
        updatedOn: Date.now(),
      },
    },
    { new: true, runValidators: true }
  ).exec();
}

/**
 * Delete a matrix data entry
 * @param {string} matrixDataId - ID of the matrix data to delete
 * @returns {Promise<Object>} Deleted matrix data
 */
export async function deleteMatrixDataFromDB(matrixDataId) {
  validateDBObjectId(matrixDataId, 'matrixDataId');
  return MatrixDataModel.findByIdAndDelete(matrixDataId).exec();
}

/**
 * Fetch a matrix data entry by ID
 * @param {string} matrixDataId - ID of the matrix data to fetch
 * @returns {Promise<Object>} Fetched matrix data
 */
export async function fetchMatrixDataByIdFromDB(matrixDataId) {
  validateDBObjectId(matrixDataId, 'matrixDataId');
  return MatrixDataModel.findById(matrixDataId).exec();
}

/**
 * Fetch matrix data entry by persona config ID
 * @param {string} personaConfigId - ID of the persona config to fetch matrix data for
 * @returns {Promise<Object>} Matrix data
 */
export async function fetchMatrixDataByPersonaConfigIdFromDB(personaConfigId) {
  validateDBObjectId(personaConfigId, 'personaConfigId');
  return MatrixDataModel.findOne({ personaConfigId }).exec();
}

/**
 * Delete matrix data by persona config ID
 * @param {string} personaConfigId - ID of the persona config to delete matrix data for
 * @returns {Promise<Object>} Delete operation result
 */
export async function deleteMatrixDataByPersonaConfigIdFromDB(personaConfigId) {
  validateDBObjectId(personaConfigId, 'personaConfigId');
  return MatrixDataModel.deleteOne({ personaConfigId }).exec();
}
