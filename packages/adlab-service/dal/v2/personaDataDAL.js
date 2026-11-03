import { PersonaDataModel } from './schemas/personaData.js';
import crypto from 'node:crypto';

//Find persona data by pagination filters
export async function findPersonaDataPaginated({ filter, offset, count }) {

  const [data, total] = await Promise.all([
    PersonaDataModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(count),
    PersonaDataModel.countDocuments(filter)
  ]);

  return {
    data,
    total,
    offset,
    pageSize: count,
    totalPages: Math.ceil(total / count)
  };
}
// Get all data by personaConfigId
export async function findPersonaDataByPersonaConfigId(personaConfigId) {
  return PersonaDataModel.find({ personaConfigId });
}
// Find documents by personaConfigId with only _id and _hash
export async function findPersonaHashesByPersonaConfigId(personaConfigId) {
  return PersonaDataModel.find(
    { personaConfigId },
    { _id: 1, _hash: 1 }
  ).lean();
}

// Delete many by _id
export async function deletePersonaDataByIds(ids) {
  return PersonaDataModel.deleteMany({ _id: { $in: ids } });
}

// Bulk insert persona data
export async function insertPersonaDataBulk(documents) {
  return PersonaDataModel.insertMany(documents, { ordered: true });
}