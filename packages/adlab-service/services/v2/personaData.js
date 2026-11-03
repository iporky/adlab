import {
  findPersonaDataPaginated,
  findPersonaHashesByPersonaConfigId,
  deletePersonaDataByIds,
  insertPersonaDataBulk
} from '../../dal/v2/personaDataDAL.js';
import mongoose from 'mongoose';
import crypto from 'crypto';
import { combinationsData } from './../../mocks/combinations.js';

/**
 * Generate the cartesian product of an object with array values.
 * Example: { a: [1, 2], b: ['x', 'y'] } =>
 * [
 *   { a: 1, b: 'x' },
 *   { a: 1, b: 'y' },
 *   { a: 2, b: 'x' },
 *   { a: 2, b: 'y' }
 * ]
 */
function cartesianProduct(obj) {
  const keys = Object.keys(obj);
  const values = Object.values(obj);
  const product = values.reduce((acc, curr) =>
    acc.flatMap(prev => curr.map(val => [...prev, val])), [[]]);

  return product.map(combo =>
    combo.reduce((acc, val, idx) => {
      acc[keys[idx]] = val;
      return acc;
    }, {}));
}

/**
 * Expand persona combinations by generating all possible variants
 * through cartesian product of each persona object
 */
function expandPersona(persona) {
  if (!persona || !Array.isArray(persona)) return [{}];
  return persona.flatMap(p => cartesianProduct(p));
}

/**
 * Create an MD5 hash string from a given object to identify uniqueness.
 */
function hashCombination(obj) {
  return crypto.createHash('md5').update(JSON.stringify(obj)).digest('hex');
}

/**
 * Generate all possible persona + mapping combinations
 * with unique hashes and Mongo ObjectIds
 */
function generatePersonaDataMappings(data) {
  const results = [];
  data.combinations.forEach(combo => {
    const { mapping, persona, key } = combo;
    const mappingCombos = cartesianProduct(mapping);
    const personaCombos = expandPersona(persona);

    mappingCombos.forEach(mapCombo => {
      personaCombos.forEach(pCombo => {
        const base = {
          key,
          ...mapCombo,
          ...pCombo,
        };

        results.push({
          _id: new mongoose.Types.ObjectId(),
          _hash: hashCombination(base),
          ...base,
        });
      });
    });
  });
  return results;
}


/**
 * Generate persona data from raw combinations:
 * - Compute hashes for uniqueness
 * - Identify new and outdated combinations
 * - Delete stale entries from DB
 * - Insert new entries into DB
 * - Return latest data for given personaConfigId
 */
export async function generatePersonaData(personaConfigId, campaignId) {
  const format = 'json';

  // Prepare new documents with meta fields
  const newData = generatePersonaDataMappings(combinationsData).map(({ _id, _hash, createdAt, ...rest }) => ({
    _id,
    _hash,
    personaConfigId,
    campaignId,
    format,
    data: rest,
    createdAt: createdAt || new Date()
  }));


  const newHashes = new Set(newData.map(d => d._hash));

  // Get existing hashes from DB
  const existingDocs = await findPersonaHashesByPersonaConfigId(personaConfigId);

  // Map existing hash => _id for quick lookup
  const existingHashToId = new Map();
  for (const doc of existingDocs) {
    existingHashToId.set(doc._hash, doc._id);
  }

  // Filter out new records not already in DB
  const toInsert = newData.filter(d => !existingHashToId.has(d._hash));

  // Find IDs of records to delete (no longer present in new data)
  const toDeleteIds = [];
  for (const [hash, id] of existingHashToId.entries()) {
    if (!newHashes.has(hash)) {
      toDeleteIds.push(id);
    }
  }

  // Remove outdated records
  if (toDeleteIds.length > 0) {
    await deletePersonaDataByIds(toDeleteIds);
  }

  // Insert new records
  if (toInsert.length > 0) {
    await insertPersonaDataBulk(toInsert);
  }
  if (toInsert.length === 0 && toDeleteIds.length === 0) {
    return false; // No change needed
  }
  return true;
}

/**
 * Fetch paginated persona data for given campaignId , personaConfigId and offset/count
 */

export async function getPersonaDataPaginated(campaignId, personaConfigId, { offset, count }) {
  const filter = {};
  if (personaConfigId) filter.personaConfigId = personaConfigId;
  if (campaignId) filter.campaignId = campaignId;
  return findPersonaDataPaginated({
    filter,
    offset: offset,
    count: parseInt(count)
  });
}

