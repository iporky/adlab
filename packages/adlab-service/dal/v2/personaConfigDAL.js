import { PersonaConfigModel } from './schemas/personaConfig.js';
import { validateDBObjectId, validateStringForNoSQLInjection } from '../../lib/util.js';

/**
 * Create a new persona config
 * @param {Object} params - Parameters for creating persona config
 * @param {Object} params.personaConfig - Persona config data
 * @param {string} params.campaignId - Campaign ID
 * @param {string} params.clientId - Client ID
 * @param {string} params.accountId - Account ID
 * @param {string} params.createdBy - User creating the persona config
 * @returns {Promise<Object>} Created persona config
 */
export async function createPersonaConfigInDB({ personaConfig, campaignId, clientId, accountId, createdBy }) {
  validateDBObjectId(campaignId, 'campaignId');
  validateStringForNoSQLInjection(clientId, 'clientId');
  validateStringForNoSQLInjection(accountId, 'accountId');

  const personaConfigDoc = new PersonaConfigModel({
    ...personaConfig,
    campaignId,
    clientId,
    accountId,
    createdBy,
  });

  return personaConfigDoc.save();
}

/**
 * Update an existing persona config
 * @param {string} personaConfigId - ID of the persona config to update
 * @param {Object} updateData - Data to update
 * @param {Object} updateData.personaConfig - Persona config data
 * @param {string} updateData.updatedBy - User updating the persona config
 * @returns {Promise<Object>} Updated persona config
 */
export async function updatePersonaConfigInDB(personaConfigId, { personaConfig, updatedBy }) {
  validateDBObjectId(personaConfigId, 'personaConfigId');

  return PersonaConfigModel.findByIdAndUpdate(
    personaConfigId,
    {
      $set: {
        ...personaConfig,
        updatedBy,
        updatedOn: Date.now(),
      },
    },
    { new: true, runValidators: true }
  ).exec();
}

/**
 * Patch a persona config with partial data
 * @param {string} personaConfigId - Persona config ID
 * @param {Object} params - Update parameters
 * @param {Object} params.personaConfig - Partial persona config data to update
 * @param {string} params.updatedBy - User updating the persona config
 * @returns {Promise<Object>} Updated persona config
 */
export async function patchPersonaConfigInDB(personaConfigId, { personaConfig, updatedBy }) {
  validateDBObjectId(personaConfigId, 'personaConfigId');

  return PersonaConfigModel.findByIdAndUpdate(
    personaConfigId,
    {
      $set: {
        ...personaConfig,
        updatedBy,
        updatedOn: Date.now(),
      },
    },
    { new: true, runValidators: true }
  ).exec();
}

/**
 * Delete a persona config
 * @param {string} personaConfigId - ID of the persona config to delete
 * @returns {Promise<Object>} Deleted persona config
 */
export async function deletePersonaConfigFromDB(personaConfigId) {
  validateDBObjectId(personaConfigId, 'personaConfigId');
  return PersonaConfigModel.findByIdAndDelete(personaConfigId).exec();
}

/**
 * Fetch a persona config by ID
 * @param {string} personaConfigId - ID of the persona config to fetch
 * @returns {Promise<Object>} Fetched persona config
 */
export async function fetchPersonaConfigByIdFromDB(personaConfigId) {
  validateDBObjectId(personaConfigId, 'personaConfigId');
  return PersonaConfigModel.findById(personaConfigId).exec();
}

/**
 * Fetch persona config for a campaign
 * @param {string} campaignId - Campaign ID
 * @param {boolean} includeCombinations - Whether to include combinations
 * @returns {Promise<Object>} Persona config
 */
export async function fetchPersonaConfigByCampaignIdFromDB(campaignId, includeCombinations = true) {
  validateDBObjectId(campaignId, 'campaignId');

  const query = PersonaConfigModel.findOne({ campaignId });
  if (!includeCombinations) {
    query.select('-combinations');
  }
  return query.exec();
}
