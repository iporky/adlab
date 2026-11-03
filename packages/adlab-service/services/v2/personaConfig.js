import {
  createPersonaConfigInDB,
  updatePersonaConfigInDB,
  deletePersonaConfigFromDB,
  fetchPersonaConfigByIdFromDB,
  fetchPersonaConfigByCampaignIdFromDB,
  patchPersonaConfigInDB,
} from '../../dal/v2/personaConfigDAL.js';

/**
 * Create a new persona config
 * @param {Object} params
 * @param {Object} params.personaConfig - Persona config data
 * @param {string} params.campaignId - Campaign ID
 * @param {string} params.clientId - Client ID
 * @param {string} params.accountId - Account ID
 * @param {string} params.createdBy - User creating the persona config
 * @returns {Promise<Object>} Created persona config
 */
export async function createPersonaConfig({
  campaignId,
  clientId,
  accountId,
  createdBy,
  template,
  status,
  combinations = [],
}) {
  return createPersonaConfigInDB({
    personaConfig: { template, status, combinations },
    campaignId,
    clientId,
    accountId,
    createdBy,
  });
}

/**
 * Get persona config by ID
 * @param {string} personaConfigId - Persona config ID
 * @returns {Promise<Object>} Persona config
 */
export async function getPersonaConfigById(personaConfigId) {
  return fetchPersonaConfigByIdFromDB(personaConfigId);
}

/**
 * Get persona config for a campaign
 * @param {string} campaignId - Campaign ID
 * @param {boolean} includeCombinations - Whether to include combinations
 * @returns {Promise<Object>} Persona config
 */
export async function getPersonaConfig(campaignId, includeCombinations = true) {
  return fetchPersonaConfigByCampaignIdFromDB(campaignId, includeCombinations);
}

/**
 * Update a persona config
 * @param {string} personaConfigId - Persona config ID
 * @param {Object} updateData - Data to update
 * @param {Object} updateData.template - Template data
 * @param {string} updateData.status - Status
 * @param {string} updateData.updatedBy - User updating the persona config
 * @returns {Promise<Object>} Updated persona config
 */
export async function updatePersonaConfig(personaConfigId, { template, status, updatedBy }) {
  return updatePersonaConfigInDB(personaConfigId, {
    personaConfig: { template, status },
    updatedBy,
  });
}

/**
 * Patch a persona config
 * @param {string} personaConfigId - Persona config ID
 * @param {Object} patchData - Data to patch
 * @param {string} updatedBy - User updating the persona config
 * @returns {Promise<Object>} Updated persona config
 */
export async function patchPersonaConfig(personaConfigId, patchData, updatedBy) {
  return patchPersonaConfigInDB(personaConfigId, {
    personaConfig: patchData,
    updatedBy,
  });
}

/**
 * Delete a persona config
 * @param {string} personaConfigId - Persona config ID
 * @returns {Promise<Object>} Deleted persona config
 */
export async function deletePersonaConfig(personaConfigId) {
  return deletePersonaConfigFromDB(personaConfigId);
}
