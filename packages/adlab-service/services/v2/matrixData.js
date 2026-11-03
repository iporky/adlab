import XLSX from 'xlsx';
import {
  createMatrixDataInDB,
  updateMatrixDataInDB,
  deleteMatrixDataFromDB,
  fetchMatrixDataByIdFromDB,
  fetchMatrixDataByPersonaConfigIdFromDB,
  deleteMatrixDataByPersonaConfigIdFromDB,
  patchMatrixDataInDB,
} from '../../dal/v2/matrixDataDAL.js';

export const uploadMatrixData = async (personaConfigId, file, userId) => {
  try {
    // Read Excel file
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawData = XLSX.utils.sheet_to_json(worksheet);

    // Transform data to column-based format
    const transformedData = transformMatrixData(rawData);

    // Remove nulls from each column array
    Object.keys(transformedData).forEach((key) => {
      transformedData[key] = transformedData[key].filter((v) => v !== null);
    });

    // Validate the transformed data
    const validation = validateMatrixData(transformedData);
    if (!validation.isValid) {
      throw new Error(validation.errors.join('; '));
    }

    // Delete existing matrix data for this persona config if any
    await deleteMatrixDataByPersonaConfigIdFromDB(personaConfigId);

    // Create and save matrix data
    return await createMatrixDataInDB({
      matrixData: {
        data: transformedData,
        format: 'Excel',
      },
      personaConfigId,
      createdBy: userId,
    });
  } catch (error) {
    throw new Error(`Failed to process matrix data: ${error.message}`);
  }
};

export const findById = async (id) => {
  const matrixData = await fetchMatrixDataByIdFromDB(id);
  if (!matrixData) {
    throw new Error('Matrix data not found');
  }
  return matrixData;
};

export const findByPersonaConfigId = async (personaConfigId) => {
  const matrixData = await fetchMatrixDataByPersonaConfigIdFromDB(personaConfigId);
  if (!matrixData) {
    throw new Error('Matrix data not found');
  }
  return matrixData;
};

export const updateMatrixData = async (id, file, userId) => {
  // First verify the matrix data exists
  await findById(id);

  try {
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawData = XLSX.utils.sheet_to_json(worksheet);

    // Transform data to column-based format
    const transformedData = transformMatrixData(rawData);

    // Validate the transformed data
    const validation = validateMatrixData(transformedData);
    if (!validation.isValid) {
      throw new Error(validation.errors.join('; '));
    }

    return await updateMatrixDataInDB(id, {
      matrixData: { data: transformedData },
      updatedBy: userId,
    });
  } catch (error) {
    throw new Error(`Failed to process Excel file: ${error.message}`);
  }
};

export const deleteMatrixData = async (id) => {
  const result = await deleteMatrixDataFromDB(id);
  if (!result) {
    throw new Error('Matrix data not found');
  }
  return result;
};

export const patchMatrixData = async (id, updateData, userId) => {
  // First verify the matrix data exists
  await findById(id);

  // Validate data array if it's being updated
  if (updateData.data) {
    if (!Array.isArray(updateData.data) || updateData.data.length === 0) {
      throw new Error('Data must be a non-empty array');
    }
  }

  return await patchMatrixDataInDB(id, {
    matrixData: updateData,
    updatedBy: userId,
  });
};

/**
 * Transforms array of row objects from Excel into column-oriented object.
 * @param {Array<Object>} rows
 * @returns {Object} { header1: [val1, val2], header2: [...] }
 */
export function transformMatrixData(rows) {
  if (!Array.isArray(rows) || rows.length === 0) return {};

  const headers = Object.keys(rows[0]);
  const result = {};

  headers.forEach((header) => {
    result[header] = rows.map((row) => row[header]).filter((v) => v !== null && v !== undefined);
  });

  return result;
}

/**
 * Example validation: checks all columns have same length and no empty headers.
 * @param {Object} data
 * @returns {{ isValid: boolean, errors: string[] }}
 */
export function validateMatrixData(data) {
  const errors = [];
  if (!data || typeof data !== 'object') {
    errors.push('Data is not an object');
    return { isValid: false, errors };
  }

  Object.keys(data).forEach((header) => {
    if (!header || header.trim() === '') {
      errors.push('Empty header found');
    }
  });

  return { isValid: errors.length === 0, errors };
}
